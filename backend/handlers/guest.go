package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"vault/config"
	"vault/models"
	"vault/security"
)

type GuestLoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

const guestSessionCookie = "guest_session"
const guestSessionDuration = 365 * 24 * time.Hour

type guestSessionPayload struct {
	AccountID uint   `json:"account_id"`
	ExpiresAt int64  `json:"expires_at"`
	Nonce     string `json:"nonce"`
}

func GuestLogin(c *gin.Context) {
	var req GuestLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	req.Login = strings.TrimSpace(req.Login)
	if req.Login == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "login and password required"})
		return
	}

	account, ok, err := authenticateGuest(req.Login, req.Password)
	if err != nil {
		respondDBError(c, err)
		return
	}
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "invalid credentials"})
		return
	}

	data, err := guestData(account)
	if err != nil {
		respondDBError(c, err)
		return
	}

	token, expiresAt, err := createGuestSession(account)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create session"})
		return
	}
	setGuestSessionCookie(c, token, int(guestSessionDuration.Seconds()))

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"data":       data,
		"expires_at": expiresAt,
	})
}

func GuestSession(c *gin.Context) {
	if c.Query("login") != "" || c.Query("password") != "" {
		writeGateResponse(c, http.StatusBadRequest, "error", gin.H{
			"success": false,
			"error":   "query credentials are not supported",
		})
		return
	}

	if account, ok := guestSessionAccount(c); ok {
		respondGuestSession(c, account)
		return
	}

	login, password, ok := guestSessionCredentials(c)
	if !ok {
		writeGateResponse(c, http.StatusBadRequest, "error", gin.H{
			"success": false,
			"error":   "login and password required",
		})
		return
	}

	account, authenticated, err := authenticateGuest(login, password)
	if err != nil {
		writeGateResponse(c, http.StatusInternalServerError, "error", gin.H{
			"success": false,
			"error":   "database error",
		})
		return
	}
	if !authenticated {
		writeGateResponse(c, http.StatusUnauthorized, "error", gin.H{
			"success": false,
			"error":   "invalid credentials",
		})
		return
	}

	respondGuestSession(c, account)
}

func GuestLogout(c *gin.Context) {
	setGuestSessionCookie(c, "", -1)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func authenticateGuest(login, password string) (models.Account, bool, error) {
	var account models.Account
	err := config.DB.Where("login = ?", login).First(&account).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return account, false, nil
	}
	if err != nil {
		return account, false, err
	}

	ok, err := security.VerifyPassword(account.Password, password)
	if err != nil || !ok {
		return account, ok, err
	}

	if !security.IsPasswordHash(account.Password) {
		hash, err := security.HashPassword(password)
		if err != nil {
			return account, false, err
		}
		account.Password = hash
		if err := config.DB.Save(&account).Error; err != nil {
			return account, false, err
		}
	}

	return account, true, nil
}

func guestData(account models.Account) (gin.H, error) {
	var transfers []models.Transfer
	if err := config.DB.Where("account_id = ?", account.ID).Find(&transfers).Error; err != nil {
		return nil, err
	}

	var files []models.File
	if err := config.DB.Omit("data").Where("account_id = ?", account.ID).Find(&files).Error; err != nil {
		return nil, err
	}

	return gin.H{
		"master":    accountToResponse(account),
		"transfers": transfers,
		"files":     filesToResponse(files),
	}, nil
}

func guestSessionCredentials(c *gin.Context) (string, string, bool) {
	if login, password, ok := c.Request.BasicAuth(); ok {
		return strings.TrimSpace(login), password, login != "" && password != ""
	}

	login := strings.TrimSpace(c.GetHeader("X-Guest-Login"))
	password := c.GetHeader("X-Guest-Password")
	return login, password, login != "" && password != ""
}

func respondGuestSession(c *gin.Context, account models.Account) {
	data, err := guestData(account)
	if err != nil {
		writeGateResponse(c, http.StatusInternalServerError, "error", gin.H{
			"success": false,
			"error":   "database error",
		})
		return
	}

	data["success"] = true
	writeGateResponse(c, http.StatusOK, "login", data)
}

func writeGateResponse(c *gin.Context, status int, event string, payload gin.H) {
	if wantsJSON(c) {
		c.Header("Cache-Control", "no-store")
		c.JSON(status, payload)
		return
	}

	eventJSON, _ := json.Marshal(event)
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not encode response"})
		return
	}

	c.Header("Cache-Control", "no-store")
	c.Data(status, "application/javascript; charset=utf-8", []byte(fmt.Sprintf("handleGateResponse(%s, %s);", eventJSON, payloadJSON)))
}

func wantsJSON(c *gin.Context) bool {
	return strings.Contains(c.GetHeader("Accept"), "application/json")
}

func setGuestSessionCookie(c *gin.Context, token string, maxAge int) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(guestSessionCookie, token, maxAge, "/", "", c.Request.TLS != nil, true)
}

func guestSessionAccount(c *gin.Context) (models.Account, bool) {
	token, err := c.Cookie(guestSessionCookie)
	if err != nil || token == "" {
		return models.Account{}, false
	}

	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return models.Account{}, false
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return models.Account{}, false
	}

	var payload guestSessionPayload
	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return models.Account{}, false
	}
	if payload.AccountID == 0 || payload.ExpiresAt == 0 || time.Now().After(time.Unix(payload.ExpiresAt, 0)) {
		return models.Account{}, false
	}

	var account models.Account
	if err := config.DB.First(&account, payload.AccountID).Error; err != nil {
		return models.Account{}, false
	}

	if !hmac.Equal([]byte(parts[1]), []byte(signGuestSession(parts[0], account.Password))) {
		return models.Account{}, false
	}

	return account, true
}

func createGuestSession(account models.Account) (string, time.Time, error) {
	nonce, err := security.RandomToken(32)
	if err != nil {
		return "", time.Time{}, err
	}

	expiresAt := time.Now().Add(guestSessionDuration)
	payloadBytes, err := json.Marshal(guestSessionPayload{
		AccountID: account.ID,
		ExpiresAt: expiresAt.Unix(),
		Nonce:     nonce,
	})
	if err != nil {
		return "", time.Time{}, err
	}

	payload := base64.RawURLEncoding.EncodeToString(payloadBytes)
	signature := signGuestSession(payload, account.Password)
	return payload + "." + signature, expiresAt, nil
}

func signGuestSession(payload string, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}
