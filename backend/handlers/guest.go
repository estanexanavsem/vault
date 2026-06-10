package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

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

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
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

func writeGateResponse(c *gin.Context, status int, event string, payload gin.H) {
	eventJSON, _ := json.Marshal(event)
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not encode response"})
		return
	}

	c.Header("Cache-Control", "no-store")
	c.Data(status, "application/javascript; charset=utf-8", []byte(fmt.Sprintf("handleGateResponse(%s, %s);", eventJSON, payloadJSON)))
}
