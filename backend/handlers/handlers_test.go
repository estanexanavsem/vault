package handlers

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"vault/config"
	"vault/models"
	"vault/security"
)

func setupHandlerTestDB(t *testing.T) {
	t.Helper()

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("open test db: %v", err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		t.Fatalf("get sql db: %v", err)
	}
	sqlDB.SetMaxOpenConns(1)
	t.Cleanup(func() {
		_ = sqlDB.Close()
	})

	if err := db.AutoMigrate(&models.Account{}, &models.Transfer{}, &models.File{}, &models.Settings{}); err != nil {
		t.Fatalf("migrate test db: %v", err)
	}
	config.DB = db
}

func TestUpdateAccountUsesFullPathID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	if err := config.DB.Create(&models.Account{ID: 12, Login: "alice", Password: hash}).Error; err != nil {
		t.Fatalf("seed account: %v", err)
	}

	router := gin.New()
	router.PUT("/accounts/:id", UpdateAccount)

	req := httptest.NewRequest(http.MethodPut, "/accounts/12", strings.NewReader(`{"holder_name":"Alice Updated"}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}

	var account models.Account
	if err := config.DB.First(&account, 12).Error; err != nil {
		t.Fatalf("load updated account: %v", err)
	}
	if account.HolderName != "Alice Updated" {
		t.Fatalf("holder name was not updated: %q", account.HolderName)
	}
	if account.ID != 12 {
		t.Fatalf("account id changed: %d", account.ID)
	}
}

func TestGuestLoginOmitsSecretsAndMigratesPlaintextPassword(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	account := models.Account{Login: "guest", Password: "plain-secret", HolderName: "Guest User"}
	if err := config.DB.Create(&account).Error; err != nil {
		t.Fatalf("seed account: %v", err)
	}
	if err := config.DB.Create(&models.File{
		AccountID: account.ID,
		Name:      "statement.pdf",
		Type:      "application/pdf",
		Size:      11,
		Data:      []byte("file-secret"),
	}).Error; err != nil {
		t.Fatalf("seed file: %v", err)
	}

	router := gin.New()
	router.POST("/guest/login", GuestLogin)

	req := httptest.NewRequest(http.MethodPost, "/guest/login", strings.NewReader(`{"login":"guest","password":"plain-secret"}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	beforeLogin := time.Now().UTC()
	router.ServeHTTP(resp, req)
	afterLogin := time.Now().UTC()

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	body := resp.Body.String()
	if strings.Contains(body, "plain-secret") || strings.Contains(body, "file-secret") || strings.Contains(body, `"password"`) {
		t.Fatalf("response leaked secret material: %s", body)
	}
	if !strings.Contains(body, `"last_sign_in_at"`) {
		t.Fatalf("response missing last_sign_in_at: %s", body)
	}

	var stored models.Account
	if err := config.DB.First(&stored, account.ID).Error; err != nil {
		t.Fatalf("load migrated account: %v", err)
	}
	if !security.IsPasswordHash(stored.Password) {
		t.Fatalf("password was not migrated to bcrypt: %q", stored.Password)
	}
	if stored.LastSignInAt == nil {
		t.Fatal("last sign-in timestamp was not stored")
	}
	if stored.LastSignInAt.Before(beforeLogin) || stored.LastSignInAt.After(afterLogin) {
		t.Fatalf("last sign-in timestamp out of login window: %s", stored.LastSignInAt.Format(time.RFC3339Nano))
	}
}

func TestUploadFileStoresDataButReturnsMetadata(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	account := models.Account{Login: "owner", Password: hash}
	if err := config.DB.Create(&account).Error; err != nil {
		t.Fatalf("seed account: %v", err)
	}

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	if err := writer.WriteField("account_id", "1"); err != nil {
		t.Fatalf("write account_id: %v", err)
	}
	part, err := writer.CreateFormFile("file", "note.txt")
	if err != nil {
		t.Fatalf("create form file: %v", err)
	}
	if _, err := part.Write([]byte("stored-secret")); err != nil {
		t.Fatalf("write file: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close multipart writer: %v", err)
	}

	router := gin.New()
	router.POST("/files", UploadFile)
	router.GET("/files", ListFiles)

	req := httptest.NewRequest(http.MethodPost, "/files", &body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", resp.Code, resp.Body.String())
	}
	if strings.Contains(resp.Body.String(), "stored-secret") || strings.Contains(resp.Body.String(), `"data"`) {
		t.Fatalf("upload response leaked file data: %s", resp.Body.String())
	}

	var file models.File
	if err := config.DB.First(&file).Error; err != nil {
		t.Fatalf("load stored file: %v", err)
	}
	if string(file.Data) != "stored-secret" || file.AccountID != account.ID {
		t.Fatalf("stored file mismatch: account=%d data=%q", file.AccountID, string(file.Data))
	}

	listReq := httptest.NewRequest(http.MethodGet, "/files", nil)
	listResp := httptest.NewRecorder()
	router.ServeHTTP(listResp, listReq)
	if listResp.Code != http.StatusOK {
		t.Fatalf("expected list 200, got %d: %s", listResp.Code, listResp.Body.String())
	}

	var files []map[string]any
	if err := json.Unmarshal(listResp.Body.Bytes(), &files); err != nil {
		t.Fatalf("decode list response: %v", err)
	}
	if len(files) != 1 {
		t.Fatalf("expected one file, got %d", len(files))
	}
	if _, ok := files[0]["data"]; ok {
		t.Fatalf("list response includes data field: %s", listResp.Body.String())
	}
}

func TestCreateAccountTrimsLoginHashesPasswordAndOmitsSecret(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.POST("/accounts", CreateAccount)
	router.GET("/accounts/:id", GetAccount)

	req := httptest.NewRequest(http.MethodPost, "/accounts", strings.NewReader(`{
		"login":"  alice  ",
		"password":"secret",
		"holder_name":"Alice",
		"balance":25.5
	}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", resp.Code, resp.Body.String())
	}
	if strings.Contains(resp.Body.String(), "secret") || strings.Contains(resp.Body.String(), `"password"`) {
		t.Fatalf("create response leaked password: %s", resp.Body.String())
	}

	var account models.Account
	if err := config.DB.First(&account).Error; err != nil {
		t.Fatalf("load account: %v", err)
	}
	if account.Login != "alice" {
		t.Fatalf("login was not trimmed: %q", account.Login)
	}
	if !security.IsPasswordHash(account.Password) {
		t.Fatalf("password was not hashed: %q", account.Password)
	}
	if account.Balance != 25.5 {
		t.Fatalf("balance was not stored: %v", account.Balance)
	}

	getResp := httptest.NewRecorder()
	router.ServeHTTP(getResp, httptest.NewRequest(http.MethodGet, "/accounts/1", nil))
	if getResp.Code != http.StatusOK {
		t.Fatalf("expected get 200, got %d: %s", getResp.Code, getResp.Body.String())
	}
	if strings.Contains(getResp.Body.String(), `"password"`) {
		t.Fatalf("get response includes password: %s", getResp.Body.String())
	}
	if !strings.Contains(getResp.Body.String(), `"balance":25.5`) {
		t.Fatalf("get response does not include balance: %s", getResp.Body.String())
	}
}

func TestGuestSessionRejectsQueryCredentials(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.GET("/guest/session", GuestSession)

	req := httptest.NewRequest(http.MethodGet, "/guest/session?login=guest&password=secret", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d: %s", resp.Code, resp.Body.String())
	}
	if got := resp.Header().Get("Cache-Control"); got != "no-store" {
		t.Fatalf("expected no-store cache control, got %q", got)
	}
	if !strings.Contains(resp.Body.String(), `handleGateResponse("error"`) {
		t.Fatalf("expected gate error response, got %s", resp.Body.String())
	}
}

func TestGuestSessionWithBasicAuthReturnsDataWithoutFileBlob(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	account := models.Account{Login: "guest", Password: hash, HolderName: "Guest User"}
	if err := config.DB.Create(&account).Error; err != nil {
		t.Fatalf("seed account: %v", err)
	}
	if err := config.DB.Create(&models.Transfer{AccountID: account.ID, Amount: 10, Status: "pending"}).Error; err != nil {
		t.Fatalf("seed transfer: %v", err)
	}
	if err := config.DB.Create(&models.File{
		AccountID: account.ID,
		Name:      "statement.pdf",
		Type:      "application/pdf",
		Size:      6,
		Data:      []byte("secret-file"),
	}).Error; err != nil {
		t.Fatalf("seed file: %v", err)
	}

	router := gin.New()
	router.GET("/guest/session", GuestSession)

	req := httptest.NewRequest(http.MethodGet, "/guest/session", nil)
	req.SetBasicAuth("guest", "secret")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	body := resp.Body.String()
	if !strings.Contains(body, `handleGateResponse("login"`) || !strings.Contains(body, `"success":true`) {
		t.Fatalf("expected successful gate response, got %s", body)
	}
	if strings.Contains(body, "secret-file") || strings.Contains(body, `"password"`) || strings.Contains(body, `"data"`) {
		t.Fatalf("guest session leaked restricted fields: %s", body)
	}

	var updated models.Account
	if err := config.DB.First(&updated, account.ID).Error; err != nil {
		t.Fatalf("reload account: %v", err)
	}
	if updated.LastSignInAt == nil {
		t.Fatalf("expected basic auth guest session to record last sign-in")
	}
}

func TestCreateTransferValidatesAccountAndAllowsNegativeAmount(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	account := models.Account{Login: "owner", Password: hash}
	if err := config.DB.Create(&account).Error; err != nil {
		t.Fatalf("seed account: %v", err)
	}

	router := gin.New()
	router.POST("/transfers", CreateTransfer)

	missing := httptest.NewRequest(http.MethodPost, "/transfers", strings.NewReader(`{"account_id":99,"amount":15}`))
	missing.Header.Set("Content-Type", "application/json")
	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, missing)
	if missingResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing account 404, got %d: %s", missingResp.Code, missingResp.Body.String())
	}

	valid := httptest.NewRequest(http.MethodPost, "/transfers", strings.NewReader(`{
		"account_id":1,
		"from_account":"checking",
		"to_account":"savings",
		"amount":-15,
		"status":"pending"
	}`))
	valid.Header.Set("Content-Type", "application/json")
	validResp := httptest.NewRecorder()
	router.ServeHTTP(validResp, valid)
	if validResp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", validResp.Code, validResp.Body.String())
	}

	var transfer models.Transfer
	if err := config.DB.First(&transfer).Error; err != nil {
		t.Fatalf("load transfer: %v", err)
	}
	if transfer.AccountID != account.ID || transfer.Amount != -15 || transfer.TransactionDate.IsZero() {
		t.Fatalf("stored transfer mismatch: %+v", transfer)
	}
}

func TestUpdateFileSanitizesNameAndMovesAccount(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	first := models.Account{Login: "first", Password: hash}
	second := models.Account{Login: "second", Password: hash}
	if err := config.DB.Create(&first).Error; err != nil {
		t.Fatalf("seed first account: %v", err)
	}
	if err := config.DB.Create(&second).Error; err != nil {
		t.Fatalf("seed second account: %v", err)
	}
	file := models.File{AccountID: first.ID, Name: "old.txt", Type: "text/plain", Data: []byte("blob")}
	if err := config.DB.Create(&file).Error; err != nil {
		t.Fatalf("seed file: %v", err)
	}

	router := gin.New()
	router.PUT("/files/:id", UpdateFile)

	req := httptest.NewRequest(http.MethodPut, "/files/1", strings.NewReader(`{
		"account_id":2,
		"name":"../secret.txt",
		"type":"text/markdown",
		"description":"updated"
	}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	if strings.Contains(resp.Body.String(), "blob") || strings.Contains(resp.Body.String(), `"data"`) {
		t.Fatalf("update response leaked file data: %s", resp.Body.String())
	}

	var stored models.File
	if err := config.DB.First(&stored, file.ID).Error; err != nil {
		t.Fatalf("load file: %v", err)
	}
	if stored.AccountID != second.ID || stored.Name != "secret.txt" || stored.Type != "text/markdown" || stored.Description != "updated" {
		t.Fatalf("stored file mismatch: %+v", stored)
	}
}

func TestUpdateSettingsValidatesKeysAndHashesPanelPassword(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.PUT("/settings", UpdateSettings)

	invalid := httptest.NewRequest(http.MethodPut, "/settings", strings.NewReader(`{"  ":"value"}`))
	invalid.Header.Set("Content-Type", "application/json")
	invalidResp := httptest.NewRecorder()
	router.ServeHTTP(invalidResp, invalid)
	if invalidResp.Code != http.StatusBadRequest {
		t.Fatalf("expected empty key 400, got %d: %s", invalidResp.Code, invalidResp.Body.String())
	}

	valid := httptest.NewRequest(http.MethodPut, "/settings", strings.NewReader(`{
		"panel_password":"new-secret",
		"theme":"dark"
	}`))
	valid.Header.Set("Content-Type", "application/json")
	validResp := httptest.NewRecorder()
	router.ServeHTTP(validResp, valid)
	if validResp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", validResp.Code, validResp.Body.String())
	}

	var panel models.Settings
	if err := config.DB.Where("key = ?", "panel_password").First(&panel).Error; err != nil {
		t.Fatalf("load panel setting: %v", err)
	}
	if panel.Value == "new-secret" || !security.IsPasswordHash(panel.Value) {
		t.Fatalf("panel password was not hashed: %q", panel.Value)
	}
	ok, err := security.VerifyPassword(panel.Value, "new-secret")
	if err != nil {
		t.Fatalf("verify panel password: %v", err)
	}
	if !ok {
		t.Fatal("stored panel password hash does not match input")
	}

	var theme models.Settings
	if err := config.DB.Where("key = ?", "theme").First(&theme).Error; err != nil {
		t.Fatalf("load theme setting: %v", err)
	}
	if theme.Value != "dark" {
		t.Fatalf("theme setting mismatch: %q", theme.Value)
	}
}
