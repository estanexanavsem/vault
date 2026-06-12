package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"vault/config"
	"vault/models"
	"vault/security"
)

func GetSettings(c *gin.Context) {
	var settings []models.Settings
	if err := config.DB.Find(&settings).Error; err != nil {
		respondDBError(c, err)
		return
	}
	result := make(map[string]string)
	for _, s := range settings {
		if s.Key == "panel_password" {
			continue
		}
		result[s.Key] = s.Value
	}
	c.JSON(http.StatusOK, result)
}

func UpdateSettings(c *gin.Context) {
	var updates map[string]string
	if err := c.ShouldBindJSON(&updates); err != nil {
		respondBadRequest(c, "invalid request")
		return
	}

	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		for key, value := range updates {
			key = strings.TrimSpace(key)
			if key == "" {
				return errInvalidSettingKey
			}
			storedValue := value
			if key == "panel_password" {
				if value == "" {
					return errEmptyPanelPassword
				}
				hash, err := security.HashPassword(value)
				if err != nil {
					return err
				}
				storedValue = hash
			}

			var setting models.Settings
			err := tx.Where("key = ?", key).First(&setting).Error
			if err == nil {
				setting.Value = storedValue
				if err := tx.Save(&setting).Error; err != nil {
					return err
				}
				continue
			}
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				return err
			}
			if err := tx.Create(&models.Settings{Key: key, Value: storedValue}).Error; err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		switch {
		case errors.Is(err, errInvalidSettingKey):
			c.JSON(http.StatusBadRequest, gin.H{"error": "setting key cannot be empty"})
		case errors.Is(err, errEmptyPanelPassword):
			c.JSON(http.StatusBadRequest, gin.H{"error": "panel_password cannot be empty"})
		default:
			respondDBError(c, err)
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"updated": true})
}

var (
	errInvalidSettingKey  = errors.New("invalid setting key")
	errEmptyPanelPassword = errors.New("empty panel password")
)
