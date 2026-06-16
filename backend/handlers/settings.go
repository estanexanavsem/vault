package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"vault/config"
	"vault/models"
	"vault/security"
)

const customTransferCategoriesKey = "transfer_custom_categories"

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

func DeleteTransferCategory(c *gin.Context) {
	category := strings.TrimSpace(c.Param("category"))
	if category == "" {
		respondBadRequest(c, "category cannot be empty")
		return
	}

	var migrated int64
	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		var setting models.Settings
		err := tx.Where("key = ?", customTransferCategoriesKey).First(&setting).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		categories := removeSettingCategory(parseSettingCategories(setting.Value), category)
		encodedCategories, err := json.Marshal(categories)
		if err != nil {
			return err
		}

		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := tx.Create(&models.Settings{
				Key:   customTransferCategoriesKey,
				Value: string(encodedCategories),
			}).Error; err != nil {
				return err
			}
		} else {
			setting.Value = string(encodedCategories)
			if err := tx.Save(&setting).Error; err != nil {
				return err
			}
		}

		result := tx.Model(&models.Transfer{}).
			Where("LOWER(category) = LOWER(?)", category).
			Update("category", "Other")
		if result.Error != nil {
			return result.Error
		}
		migrated = result.RowsAffected
		return nil
	}); err != nil {
		respondDBError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true, "migrated": migrated})
}

var (
	errInvalidSettingKey  = errors.New("invalid setting key")
	errEmptyPanelPassword = errors.New("empty panel password")
)

func parseSettingCategories(value string) []string {
	var categories []string
	if err := json.Unmarshal([]byte(value), &categories); err != nil {
		return []string{}
	}
	return categories
}

func removeSettingCategory(categories []string, category string) []string {
	nextCategories := make([]string, 0, len(categories))
	for _, item := range categories {
		if !strings.EqualFold(item, category) {
			nextCategories = append(nextCategories, item)
		}
	}
	return nextCategories
}
