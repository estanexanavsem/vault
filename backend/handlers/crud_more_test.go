package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"vault/config"
	"vault/models"
	"vault/security"
)

func seedAccount(t *testing.T, login string) models.Account {
	t.Helper()

	hash, err := security.HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	account := models.Account{Login: login, Password: hash, HolderName: login}
	if err := config.DB.Create(&account).Error; err != nil {
		t.Fatalf("seed account %q: %v", login, err)
	}
	return account
}

func TestListAndDeleteAccounts(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	seedAccount(t, "alice")
	seedAccount(t, "bob")

	router := gin.New()
	router.GET("/accounts", ListAccounts)
	router.DELETE("/accounts/:id", DeleteAccount)

	listResp := httptest.NewRecorder()
	router.ServeHTTP(listResp, httptest.NewRequest(http.MethodGet, "/accounts", nil))
	if listResp.Code != http.StatusOK {
		t.Fatalf("expected list 200, got %d: %s", listResp.Code, listResp.Body.String())
	}
	if strings.Contains(listResp.Body.String(), `"password"`) {
		t.Fatalf("list response includes password: %s", listResp.Body.String())
	}

	deleteResp := httptest.NewRecorder()
	router.ServeHTTP(deleteResp, httptest.NewRequest(http.MethodDelete, "/accounts/1", nil))
	if deleteResp.Code != http.StatusOK {
		t.Fatalf("expected delete 200, got %d: %s", deleteResp.Code, deleteResp.Body.String())
	}

	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, httptest.NewRequest(http.MethodDelete, "/accounts/99", nil))
	if missingResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing delete 404, got %d: %s", missingResp.Code, missingResp.Body.String())
	}
}

func TestCreateAccountRejectsInvalidRequests(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.POST("/accounts", CreateAccount)

	tests := []struct {
		name string
		body string
		want int
	}{
		{name: "invalid json", body: `{`, want: http.StatusBadRequest},
		{name: "missing password", body: `{"login":"alice"}`, want: http.StatusBadRequest},
		{name: "empty login", body: `{"login":" ","password":"secret"}`, want: http.StatusBadRequest},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/accounts", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			resp := httptest.NewRecorder()
			router.ServeHTTP(resp, req)
			if resp.Code != tt.want {
				t.Fatalf("expected %d, got %d: %s", tt.want, resp.Code, resp.Body.String())
			}
		})
	}
}

func TestUpdateAccountValidationAndAllFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")

	router := gin.New()
	router.PUT("/accounts/:id", UpdateAccount)

	invalidLogin := httptest.NewRequest(http.MethodPut, "/accounts/1", strings.NewReader(`{"login":" "}`))
	invalidLogin.Header.Set("Content-Type", "application/json")
	invalidLoginResp := httptest.NewRecorder()
	router.ServeHTTP(invalidLoginResp, invalidLogin)
	if invalidLoginResp.Code != http.StatusBadRequest {
		t.Fatalf("expected empty login 400, got %d: %s", invalidLoginResp.Code, invalidLoginResp.Body.String())
	}

	emptyPassword := httptest.NewRequest(http.MethodPut, "/accounts/1", strings.NewReader(`{"password":""}`))
	emptyPassword.Header.Set("Content-Type", "application/json")
	emptyPasswordResp := httptest.NewRecorder()
	router.ServeHTTP(emptyPasswordResp, emptyPassword)
	if emptyPasswordResp.Code != http.StatusBadRequest {
		t.Fatalf("expected empty password 400, got %d: %s", emptyPasswordResp.Code, emptyPasswordResp.Body.String())
	}

	update := httptest.NewRequest(http.MethodPut, "/accounts/1", strings.NewReader(`{
		"login":" updated ",
		"password":"new-secret",
		"holder_name":"Updated Holder",
		"account_name":"Checking",
		"account_number":"123",
		"routing_number":"456",
		"email":"updated@example.com",
		"phone":"555",
		"balance":42.25
	}`))
	update.Header.Set("Content-Type", "application/json")
	updateResp := httptest.NewRecorder()
	router.ServeHTTP(updateResp, update)
	if updateResp.Code != http.StatusOK {
		t.Fatalf("expected update 200, got %d: %s", updateResp.Code, updateResp.Body.String())
	}

	var stored models.Account
	if err := config.DB.First(&stored, account.ID).Error; err != nil {
		t.Fatalf("load account: %v", err)
	}
	if stored.Login != "updated" ||
		stored.HolderName != "Updated Holder" ||
		stored.AccountName != "Checking" ||
		stored.AccountNumber != "123" ||
		stored.RoutingNumber != "456" ||
		stored.Email != "updated@example.com" ||
		stored.Phone != "555" ||
		stored.Balance != 42.25 {
		t.Fatalf("stored account mismatch: %+v", stored)
	}
	ok, err := security.VerifyPassword(stored.Password, "new-secret")
	if err != nil {
		t.Fatalf("verify updated password: %v", err)
	}
	if !ok {
		t.Fatal("updated password hash does not match")
	}
}

func TestFileJSONCreateDownloadAndDelete(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")

	router := gin.New()
	router.POST("/files", CreateFile)
	router.GET("/files/:id", GetFile)
	router.DELETE("/files/:id", DeleteFile)

	createReq := httptest.NewRequest(http.MethodPost, "/files", strings.NewReader(`{
		"account_id":1,
		"name":"../report.txt",
		"type":"text/plain",
		"description":"empty shell"
	}`))
	createReq.Header.Set("Content-Type", "application/json")
	createResp := httptest.NewRecorder()
	router.ServeHTTP(createResp, createReq)
	if createResp.Code != http.StatusCreated {
		t.Fatalf("expected create file 201, got %d: %s", createResp.Code, createResp.Body.String())
	}

	var file models.File
	if err := config.DB.First(&file).Error; err != nil {
		t.Fatalf("load file: %v", err)
	}
	if file.AccountID != account.ID || file.Name != "report.txt" {
		t.Fatalf("stored file mismatch: %+v", file)
	}

	file.Data = []byte("download-body")
	if err := config.DB.Save(&file).Error; err != nil {
		t.Fatalf("save file data: %v", err)
	}

	getResp := httptest.NewRecorder()
	router.ServeHTTP(getResp, httptest.NewRequest(http.MethodGet, "/files/1", nil))
	if getResp.Code != http.StatusOK {
		t.Fatalf("expected get file 200, got %d: %s", getResp.Code, getResp.Body.String())
	}
	if getResp.Body.String() != "download-body" {
		t.Fatalf("unexpected file body: %q", getResp.Body.String())
	}
	if got := getResp.Header().Get("X-Content-Type-Options"); got != "nosniff" {
		t.Fatalf("expected nosniff header, got %q", got)
	}
	if !strings.Contains(getResp.Header().Get("Content-Disposition"), `filename="report.txt"`) {
		t.Fatalf("unexpected content disposition: %q", getResp.Header().Get("Content-Disposition"))
	}

	deleteResp := httptest.NewRecorder()
	router.ServeHTTP(deleteResp, httptest.NewRequest(http.MethodDelete, "/files/1", nil))
	if deleteResp.Code != http.StatusOK {
		t.Fatalf("expected delete file 200, got %d: %s", deleteResp.Code, deleteResp.Body.String())
	}

	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, httptest.NewRequest(http.MethodDelete, "/files/1", nil))
	if missingResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing file 404, got %d: %s", missingResp.Code, missingResp.Body.String())
	}
}

func TestFileDownloadDefaultsAndSafeFilename(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")
	if err := config.DB.Create(&models.File{
		AccountID: account.ID,
		Name:      "../bad\r\n\"name.txt",
		Data:      []byte("body"),
	}).Error; err != nil {
		t.Fatalf("seed file: %v", err)
	}

	router := gin.New()
	router.GET("/files/:id", GetFile)

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, "/files/1", nil))
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	if got := resp.Header().Get("Content-Type"); !strings.HasPrefix(got, "application/octet-stream") {
		t.Fatalf("expected octet-stream content type, got %q", got)
	}
	disposition := resp.Header().Get("Content-Disposition")
	if strings.ContainsAny(disposition, "\r\n") {
		t.Fatalf("unsafe content disposition: %q", resp.Header().Get("Content-Disposition"))
	}
	if !strings.Contains(disposition, `filename="badname.txt"`) {
		t.Fatalf("sanitized filename missing from content disposition: %q", disposition)
	}

	if got := safeHeaderFilename(""); got != "download" {
		t.Fatalf("empty filename fallback mismatch: %q", got)
	}
}

func TestTransferListGetUpdateAndDelete(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	first := seedAccount(t, "first")
	second := seedAccount(t, "second")
	when := time.Date(2026, 1, 2, 3, 4, 5, 0, time.UTC)
	transfer := models.Transfer{
		AccountID:       first.ID,
		FromAccount:     "checking",
		ToAccount:       "savings",
		Amount:          10,
		Description:     "old",
		Status:          "pending",
		TransactionDate: when,
	}
	if err := config.DB.Create(&transfer).Error; err != nil {
		t.Fatalf("seed transfer: %v", err)
	}

	router := gin.New()
	router.GET("/transfers", ListTransfers)
	router.GET("/transfers/:id", GetTransfer)
	router.PUT("/transfers/:id", UpdateTransfer)
	router.DELETE("/transfers/:id", DeleteTransfer)

	listResp := httptest.NewRecorder()
	router.ServeHTTP(listResp, httptest.NewRequest(http.MethodGet, "/transfers", nil))
	if listResp.Code != http.StatusOK || !strings.Contains(listResp.Body.String(), `"amount":10`) {
		t.Fatalf("unexpected list response %d: %s", listResp.Code, listResp.Body.String())
	}

	getResp := httptest.NewRecorder()
	router.ServeHTTP(getResp, httptest.NewRequest(http.MethodGet, "/transfers/1", nil))
	if getResp.Code != http.StatusOK || !strings.Contains(getResp.Body.String(), `"status":"pending"`) {
		t.Fatalf("unexpected get response %d: %s", getResp.Code, getResp.Body.String())
	}

	updateReq := httptest.NewRequest(http.MethodPut, "/transfers/1", strings.NewReader(`{
		"account_id":2,
		"from_account":"updated-from",
		"to_account":"updated-to",
		"amount":22.5,
		"description":"updated",
		"status":"posted",
		"transaction_date":"2026-02-03T04:05:06Z"
	}`))
	updateReq.Header.Set("Content-Type", "application/json")
	updateResp := httptest.NewRecorder()
	router.ServeHTTP(updateResp, updateReq)
	if updateResp.Code != http.StatusOK {
		t.Fatalf("expected update transfer 200, got %d: %s", updateResp.Code, updateResp.Body.String())
	}

	var stored models.Transfer
	if err := config.DB.First(&stored, transfer.ID).Error; err != nil {
		t.Fatalf("load transfer: %v", err)
	}
	if stored.AccountID != second.ID || stored.Amount != 22.5 || stored.Status != "posted" || stored.Description != "updated" {
		t.Fatalf("stored transfer mismatch: %+v", stored)
	}

	negativeReq := httptest.NewRequest(http.MethodPut, "/transfers/1", strings.NewReader(`{"amount":-1}`))
	negativeReq.Header.Set("Content-Type", "application/json")
	negativeResp := httptest.NewRecorder()
	router.ServeHTTP(negativeResp, negativeReq)
	if negativeResp.Code != http.StatusBadRequest {
		t.Fatalf("expected negative update 400, got %d: %s", negativeResp.Code, negativeResp.Body.String())
	}

	deleteResp := httptest.NewRecorder()
	router.ServeHTTP(deleteResp, httptest.NewRequest(http.MethodDelete, "/transfers/1", nil))
	if deleteResp.Code != http.StatusOK {
		t.Fatalf("expected delete transfer 200, got %d: %s", deleteResp.Code, deleteResp.Body.String())
	}

	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, httptest.NewRequest(http.MethodDelete, "/transfers/1", nil))
	if missingResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing transfer 404, got %d: %s", missingResp.Code, missingResp.Body.String())
	}
}

func TestCreateTransferRequiresAccountAndAcceptsExplicitDate(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")

	router := gin.New()
	router.POST("/transfers", CreateTransfer)

	missingAccountID := httptest.NewRequest(http.MethodPost, "/transfers", strings.NewReader(`{"amount":10}`))
	missingAccountID.Header.Set("Content-Type", "application/json")
	missingAccountIDResp := httptest.NewRecorder()
	router.ServeHTTP(missingAccountIDResp, missingAccountID)
	if missingAccountIDResp.Code != http.StatusBadRequest {
		t.Fatalf("expected missing account_id 400, got %d: %s", missingAccountIDResp.Code, missingAccountIDResp.Body.String())
	}

	req := httptest.NewRequest(http.MethodPost, "/transfers", strings.NewReader(`{
		"account_id":1,
		"amount":10,
		"transaction_date":"2026-03-04T05:06:07Z"
	}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	if resp.Code != http.StatusCreated {
		t.Fatalf("expected explicit date create 201, got %d: %s", resp.Code, resp.Body.String())
	}

	var transfer models.Transfer
	if err := config.DB.First(&transfer).Error; err != nil {
		t.Fatalf("load transfer: %v", err)
	}
	if transfer.AccountID != account.ID || !transfer.TransactionDate.Equal(time.Date(2026, 3, 4, 5, 6, 7, 0, time.UTC)) {
		t.Fatalf("transfer explicit date mismatch: %+v", transfer)
	}
}

func TestGetSettingsOmitsPanelPassword(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	if err := config.DB.Create(&models.Settings{Key: "panel_password", Value: "secret"}).Error; err != nil {
		t.Fatalf("seed panel setting: %v", err)
	}
	if err := config.DB.Create(&models.Settings{Key: "theme", Value: "dark"}).Error; err != nil {
		t.Fatalf("seed theme setting: %v", err)
	}

	router := gin.New()
	router.GET("/settings", GetSettings)

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, "/settings", nil))
	if resp.Code != http.StatusOK {
		t.Fatalf("expected settings 200, got %d: %s", resp.Code, resp.Body.String())
	}
	if strings.Contains(resp.Body.String(), "panel_password") || strings.Contains(resp.Body.String(), "secret") {
		t.Fatalf("settings response leaked panel password: %s", resp.Body.String())
	}
	if !strings.Contains(resp.Body.String(), `"theme":"dark"`) {
		t.Fatalf("settings response missing theme: %s", resp.Body.String())
	}
}

func TestUpdateSettingsRejectsEmptyPanelPasswordAndUpdatesExisting(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	if err := config.DB.Create(&models.Settings{Key: "theme", Value: "light"}).Error; err != nil {
		t.Fatalf("seed setting: %v", err)
	}

	router := gin.New()
	router.PUT("/settings", UpdateSettings)

	emptyPanel := httptest.NewRequest(http.MethodPut, "/settings", strings.NewReader(`{"panel_password":""}`))
	emptyPanel.Header.Set("Content-Type", "application/json")
	emptyPanelResp := httptest.NewRecorder()
	router.ServeHTTP(emptyPanelResp, emptyPanel)
	if emptyPanelResp.Code != http.StatusBadRequest {
		t.Fatalf("expected empty panel password 400, got %d: %s", emptyPanelResp.Code, emptyPanelResp.Body.String())
	}

	update := httptest.NewRequest(http.MethodPut, "/settings", strings.NewReader(`{"theme":"dark"}`))
	update.Header.Set("Content-Type", "application/json")
	updateResp := httptest.NewRecorder()
	router.ServeHTTP(updateResp, update)
	if updateResp.Code != http.StatusOK {
		t.Fatalf("expected update setting 200, got %d: %s", updateResp.Code, updateResp.Body.String())
	}

	var setting models.Settings
	if err := config.DB.Where("key = ?", "theme").First(&setting).Error; err != nil {
		t.Fatalf("load setting: %v", err)
	}
	if setting.Value != "dark" {
		t.Fatalf("existing setting was not updated: %q", setting.Value)
	}
}

func TestInvalidIDsReturnBadRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.GET("/accounts/:id", GetAccount)
	router.GET("/transfers/:id", GetTransfer)
	router.GET("/files/:id", GetFile)

	for _, path := range []string{"/accounts/0", "/transfers/not-a-number", "/files/0"} {
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, path, nil))
		if resp.Code != http.StatusBadRequest {
			t.Fatalf("%s: expected 400, got %d: %s", path, resp.Code, resp.Body.String())
		}
	}
}

func TestRespondDBErrorHandlesGenericDatabaseErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	sqlDB, err := config.DB.DB()
	if err != nil {
		t.Fatalf("get sql db: %v", err)
	}
	if err := sqlDB.Close(); err != nil {
		t.Fatalf("close db: %v", err)
	}

	router := gin.New()
	router.GET("/accounts", ListAccounts)

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, "/accounts", nil))
	if resp.Code != http.StatusInternalServerError && resp.Code != http.StatusNotFound {
		t.Fatalf("expected database error status, got %d: %s", resp.Code, resp.Body.String())
	}
	if resp.Code == http.StatusOK {
		t.Fatal("closed database should not return success")
	}
}

func TestMissingRecordsReturnNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.GET("/accounts/:id", GetAccount)
	router.GET("/transfers/:id", GetTransfer)
	router.GET("/files/:id", GetFile)

	for _, path := range []string{"/accounts/99", "/transfers/99", "/files/99"} {
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, path, nil))
		if resp.Code != http.StatusNotFound {
			t.Fatalf("%s: expected 404, got %d: %s", path, resp.Code, resp.Body.String())
		}
	}
}

func TestUpdateTransferRejectsMissingAccount(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")
	if err := config.DB.Create(&models.Transfer{AccountID: account.ID, Amount: 1}).Error; err != nil {
		t.Fatalf("seed transfer: %v", err)
	}

	router := gin.New()
	router.PUT("/transfers/:id", UpdateTransfer)

	req := httptest.NewRequest(http.MethodPut, "/transfers/1", strings.NewReader(`{"account_id":99}`))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected missing account 404, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestUpdateFileRejectsZeroAndMissingAccount(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	account := seedAccount(t, "owner")
	if err := config.DB.Create(&models.File{AccountID: account.ID, Name: "file.txt"}).Error; err != nil {
		t.Fatalf("seed file: %v", err)
	}

	router := gin.New()
	router.PUT("/files/:id", UpdateFile)

	zero := httptest.NewRequest(http.MethodPut, "/files/1", strings.NewReader(`{"account_id":0}`))
	zero.Header.Set("Content-Type", "application/json")
	zeroResp := httptest.NewRecorder()
	router.ServeHTTP(zeroResp, zero)
	if zeroResp.Code != http.StatusBadRequest {
		t.Fatalf("expected zero account 400, got %d: %s", zeroResp.Code, zeroResp.Body.String())
	}

	missing := httptest.NewRequest(http.MethodPut, "/files/1", strings.NewReader(`{"account_id":99}`))
	missing.Header.Set("Content-Type", "application/json")
	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, missing)
	if missingResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing account 404, got %d: %s", missingResp.Code, missingResp.Body.String())
	}
}

func TestCreateFileRejectsMissingAccountIDAndMissingAccount(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.POST("/files", CreateFile)

	noAccount := httptest.NewRequest(http.MethodPost, "/files", strings.NewReader(`{"name":"file.txt"}`))
	noAccount.Header.Set("Content-Type", "application/json")
	noAccountResp := httptest.NewRecorder()
	router.ServeHTTP(noAccountResp, noAccount)
	if noAccountResp.Code != http.StatusBadRequest {
		t.Fatalf("expected missing account_id 400, got %d: %s", noAccountResp.Code, noAccountResp.Body.String())
	}

	missingAccount := httptest.NewRequest(http.MethodPost, "/files", strings.NewReader(`{"account_id":99,"name":"file.txt"}`))
	missingAccount.Header.Set("Content-Type", "application/json")
	missingAccountResp := httptest.NewRecorder()
	router.ServeHTTP(missingAccountResp, missingAccount)
	if missingAccountResp.Code != http.StatusNotFound {
		t.Fatalf("expected missing account 404, got %d: %s", missingAccountResp.Code, missingAccountResp.Body.String())
	}
}

func TestUploadFileRejectsMissingFileAndAccountID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)

	router := gin.New()
	router.POST("/files", UploadFile)

	noFile := httptest.NewRequest(http.MethodPost, "/files", strings.NewReader(""))
	noFile.Header.Set("Content-Type", "multipart/form-data; boundary=empty")
	noFileResp := httptest.NewRecorder()
	router.ServeHTTP(noFileResp, noFile)
	if noFileResp.Code != http.StatusBadRequest {
		t.Fatalf("expected no file 400, got %d: %s", noFileResp.Code, noFileResp.Body.String())
	}

	body := strings.NewReader("--x\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.txt\"\r\n\r\nbody\r\n--x--\r\n")
	noAccount := httptest.NewRequest(http.MethodPost, "/files", body)
	noAccount.Header.Set("Content-Type", "multipart/form-data; boundary=x")
	noAccountResp := httptest.NewRecorder()
	router.ServeHTTP(noAccountResp, noAccount)
	if noAccountResp.Code != http.StatusBadRequest {
		t.Fatalf("expected missing account_id 400, got %d: %s", noAccountResp.Code, noAccountResp.Body.String())
	}
}

func TestGuestLoginValidationAndUnauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	seedAccount(t, "guest")

	router := gin.New()
	router.POST("/guest/login", GuestLogin)

	invalid := httptest.NewRequest(http.MethodPost, "/guest/login", strings.NewReader(`{`))
	invalid.Header.Set("Content-Type", "application/json")
	invalidResp := httptest.NewRecorder()
	router.ServeHTTP(invalidResp, invalid)
	if invalidResp.Code != http.StatusBadRequest {
		t.Fatalf("expected invalid json 400, got %d: %s", invalidResp.Code, invalidResp.Body.String())
	}

	missing := httptest.NewRequest(http.MethodPost, "/guest/login", strings.NewReader(`{"login":" "}`))
	missing.Header.Set("Content-Type", "application/json")
	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, missing)
	if missingResp.Code != http.StatusBadRequest {
		t.Fatalf("expected missing credentials 400, got %d: %s", missingResp.Code, missingResp.Body.String())
	}

	wrong := httptest.NewRequest(http.MethodPost, "/guest/login", strings.NewReader(`{"login":"guest","password":"wrong"}`))
	wrong.Header.Set("Content-Type", "application/json")
	wrongResp := httptest.NewRecorder()
	router.ServeHTTP(wrongResp, wrong)
	if wrongResp.Code != http.StatusUnauthorized {
		t.Fatalf("expected wrong credentials 401, got %d: %s", wrongResp.Code, wrongResp.Body.String())
	}
}

func TestGuestSessionHeadersMissingAndWrongCredentials(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupHandlerTestDB(t)
	seedAccount(t, "guest")

	router := gin.New()
	router.GET("/guest/session", GuestSession)

	missingResp := httptest.NewRecorder()
	router.ServeHTTP(missingResp, httptest.NewRequest(http.MethodGet, "/guest/session", nil))
	if missingResp.Code != http.StatusBadRequest {
		t.Fatalf("expected missing credentials 400, got %d: %s", missingResp.Code, missingResp.Body.String())
	}

	wrong := httptest.NewRequest(http.MethodGet, "/guest/session", nil)
	wrong.Header.Set("X-Guest-Login", "guest")
	wrong.Header.Set("X-Guest-Password", "wrong")
	wrongResp := httptest.NewRecorder()
	router.ServeHTTP(wrongResp, wrong)
	if wrongResp.Code != http.StatusUnauthorized {
		t.Fatalf("expected wrong credentials 401, got %d: %s", wrongResp.Code, wrongResp.Body.String())
	}

	right := httptest.NewRequest(http.MethodGet, "/guest/session", nil)
	right.Header.Set("X-Guest-Login", " guest ")
	right.Header.Set("X-Guest-Password", "secret")
	rightResp := httptest.NewRecorder()
	router.ServeHTTP(rightResp, right)
	if rightResp.Code != http.StatusOK {
		t.Fatalf("expected header credentials 200, got %d: %s", rightResp.Code, rightResp.Body.String())
	}
}

func TestHelperFunctionsDirectly(t *testing.T) {
	accounts := accountsToResponse([]models.Account{{ID: 1, Login: "a"}, {ID: 2, Login: "b"}})
	if len(accounts) != 2 || accounts[0].Login != "a" || accounts[1].ID != 2 {
		t.Fatalf("accounts response mismatch: %+v", accounts)
	}

	if safeHeaderFilename("../") != "download" {
		t.Fatalf("expected directory-like filename to fall back to download")
	}

	if err := gorm.ErrRecordNotFound; err == nil {
		t.Fatal("unexpected nil gorm sentinel")
	}
}
