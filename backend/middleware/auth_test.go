package middleware

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"vault/config"
	"vault/models"
	"vault/security"
)

func setupMiddlewareTestDB(t *testing.T) {
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

	if err := db.AutoMigrate(&models.Settings{}); err != nil {
		t.Fatalf("migrate test db: %v", err)
	}

	hash, err := security.HashPassword("panel-secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	if err := db.Create(&models.Settings{Key: "panel_password", Value: hash}).Error; err != nil {
		t.Fatalf("seed panel password: %v", err)
	}

	config.DB = db
}

func TestPanelLoginTokenAuthorizesLaterRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupMiddlewareTestDB(t)

	router := gin.New()
	router.POST("/login", CheckPanelPassword())
	protected := router.Group("")
	protected.Use(PanelAuth())
	protected.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	unauthorizedReq := httptest.NewRequest(http.MethodGet, "/protected", nil)
	unauthorizedResp := httptest.NewRecorder()
	router.ServeHTTP(unauthorizedResp, unauthorizedReq)
	if unauthorizedResp.Code != http.StatusUnauthorized {
		t.Fatalf("expected protected route to require auth, got %d", unauthorizedResp.Code)
	}

	loginReq := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(`{"password":"panel-secret"}`))
	loginReq.Header.Set("Content-Type", "application/json")
	loginResp := httptest.NewRecorder()
	router.ServeHTTP(loginResp, loginReq)
	if loginResp.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d: %s", loginResp.Code, loginResp.Body.String())
	}

	var loginPayload struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(loginResp.Body.Bytes(), &loginPayload); err != nil {
		t.Fatalf("decode login response: %v", err)
	}
	if loginPayload.Token == "" {
		t.Fatalf("login response did not include token: %s", loginResp.Body.String())
	}

	protectedReq := httptest.NewRequest(http.MethodGet, "/protected", nil)
	protectedReq.Header.Set("Authorization", "Bearer "+loginPayload.Token)
	protectedResp := httptest.NewRecorder()
	router.ServeHTTP(protectedResp, protectedReq)
	if protectedResp.Code != http.StatusOK {
		t.Fatalf("expected protected route 200, got %d: %s", protectedResp.Code, protectedResp.Body.String())
	}
}

func TestPanelLogoutClearsCookie(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupMiddlewareTestDB(t)

	router := gin.New()
	router.POST("/login", CheckPanelPassword())
	protected := router.Group("")
	protected.Use(PanelAuth())
	protected.POST("/logout", LogoutPanel())
	protected.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	loginReq := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(`{"password":"panel-secret"}`))
	loginReq.Header.Set("Content-Type", "application/json")
	loginResp := httptest.NewRecorder()
	router.ServeHTTP(loginResp, loginReq)
	if loginResp.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d: %s", loginResp.Code, loginResp.Body.String())
	}

	var loginPayload struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(loginResp.Body.Bytes(), &loginPayload); err != nil {
		t.Fatalf("decode login response: %v", err)
	}
	if loginPayload.Token == "" {
		t.Fatalf("login response did not include token: %s", loginResp.Body.String())
	}

	logoutReq := httptest.NewRequest(http.MethodPost, "/logout", nil)
	logoutReq.Header.Set("Authorization", "Bearer "+loginPayload.Token)
	logoutResp := httptest.NewRecorder()
	router.ServeHTTP(logoutResp, logoutReq)
	if logoutResp.Code != http.StatusOK {
		t.Fatalf("expected logout 200, got %d: %s", logoutResp.Code, logoutResp.Body.String())
	}

	cookies := logoutResp.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected logout cookie, got headers %v", logoutResp.Header())
	}
	if cookies[0].Value != "" || cookies[0].MaxAge >= 0 {
		t.Fatalf("expected logout to clear cookie, got %#v", cookies[0])
	}
}

func TestPanelLoginRejectsInvalidRequests(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupMiddlewareTestDB(t)

	router := gin.New()
	router.POST("/login", CheckPanelPassword())

	tests := []struct {
		name string
		body string
		want int
	}{
		{name: "invalid json", body: `{`, want: http.StatusBadRequest},
		{name: "empty password", body: `{"password":""}`, want: http.StatusBadRequest},
		{name: "wrong password", body: `{"password":"wrong"}`, want: http.StatusUnauthorized},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			resp := httptest.NewRecorder()
			router.ServeHTTP(resp, req)
			if resp.Code != tt.want {
				t.Fatalf("expected %d, got %d: %s", tt.want, resp.Code, resp.Body.String())
			}
		})
	}
}

func TestPanelLoginMigratesPlaintextPasswordAndCookieAuthorizes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupMiddlewareTestDB(t)

	if err := config.DB.Model(&models.Settings{}).
		Where("key = ?", "panel_password").
		Update("value", "legacy-secret").Error; err != nil {
		t.Fatalf("set legacy password: %v", err)
	}

	router := gin.New()
	router.POST("/login", CheckPanelPassword())
	protected := router.Group("")
	protected.Use(PanelAuth())
	protected.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	loginReq := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(`{"password":"legacy-secret"}`))
	loginReq.Header.Set("Content-Type", "application/json")
	loginResp := httptest.NewRecorder()
	router.ServeHTTP(loginResp, loginReq)
	if loginResp.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d: %s", loginResp.Code, loginResp.Body.String())
	}

	var setting models.Settings
	if err := config.DB.Where("key = ?", "panel_password").First(&setting).Error; err != nil {
		t.Fatalf("load migrated setting: %v", err)
	}
	if !security.IsPasswordHash(setting.Value) {
		t.Fatalf("panel password was not migrated: %q", setting.Value)
	}

	cookies := loginResp.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected login cookie, got headers %v", loginResp.Header())
	}
	protectedReq := httptest.NewRequest(http.MethodGet, "/protected", nil)
	protectedReq.AddCookie(cookies[0])
	protectedResp := httptest.NewRecorder()
	router.ServeHTTP(protectedResp, protectedReq)
	if protectedResp.Code != http.StatusOK {
		t.Fatalf("expected cookie auth 200, got %d: %s", protectedResp.Code, protectedResp.Body.String())
	}
}

func TestExpiredPanelSessionIsRejected(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupMiddlewareTestDB(t)

	var settings models.Settings
	if err := config.DB.Where("key = ?", "panel_password").First(&settings).Error; err != nil {
		t.Fatalf("load panel password: %v", err)
	}

	expiredPayload := base64.RawURLEncoding.EncodeToString([]byte(`{"expires_at":1,"nonce":"expired"}`))
	expiredToken := expiredPayload + "." + signPanelSession(expiredPayload, settings.Value)
	if validPanelSession(expiredToken) {
		t.Fatal("expected expired session to be invalid")
	}
}
