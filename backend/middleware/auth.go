package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"vault/config"
	"vault/models"
	"vault/security"
)

const panelSessionCookie = "panel_session"
const panelSessionDuration = 365 * 24 * time.Hour

type panelSessionPayload struct {
	ExpiresAt int64  `json:"expires_at"`
	Nonce     string `json:"nonce"`
}

func PanelAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := bearerToken(c.GetHeader("Authorization"))
		if token == "" {
			token, _ = c.Cookie(panelSessionCookie)
		}

		if !validPanelSession(token) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func CheckPanelPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
			return
		}
		if input.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "password required"})
			return
		}

		var settings models.Settings
		if err := config.DB.Where("key = ?", "panel_password").First(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "configuration error"})
			return
		}

		ok, err := security.VerifyPassword(settings.Value, input.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "configuration error"})
			return
		}
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid password"})
			return
		}

		if !security.IsPasswordHash(settings.Value) {
			hash, err := security.HashPassword(input.Password)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "configuration error"})
				return
			}
			settings.Value = hash
			if err := config.DB.Save(&settings).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
				return
			}
		}

		token, expiresAt, err := createPanelSession(settings.Value)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create session"})
			return
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie(panelSessionCookie, token, int(panelSessionDuration.Seconds()), "/", "", c.Request.TLS != nil, true)
		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"token":      token,
			"expires_at": expiresAt,
		})
	}
}

func LogoutPanel() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie(panelSessionCookie, "", -1, "/", "", c.Request.TLS != nil, true)
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

func createPanelSession(secret string) (string, time.Time, error) {
	nonce, err := security.RandomToken(32)
	if err != nil {
		return "", time.Time{}, err
	}

	expiresAt := time.Now().Add(panelSessionDuration)
	token, err := security.SignedSessionToken(panelSessionPayload{
		ExpiresAt: expiresAt.Unix(),
		Nonce:     nonce,
	}, secret)
	if err != nil {
		return "", time.Time{}, err
	}
	return token, expiresAt, nil
}

func validPanelSession(token string) bool {
	if token == "" {
		return false
	}

	var settings models.Settings
	if err := config.DB.Where("key = ?", "panel_password").First(&settings).Error; err != nil {
		return false
	}

	var payload panelSessionPayload
	if err := security.DecodeSignedSessionToken(token, settings.Value, &payload); err != nil {
		return false
	}
	if payload.ExpiresAt == 0 || time.Now().After(time.Unix(payload.ExpiresAt, 0)) {
		return false
	}
	return true
}

func signPanelSession(payload string, secret string) string {
	return security.SignSessionPayload(payload, secret)
}

func bearerToken(header string) string {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(header, prefix))
}
