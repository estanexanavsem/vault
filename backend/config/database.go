package config

import (
	"errors"
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"vault/models"
	"vault/security"
)

var DB *gorm.DB

func InitDB(dbPath string) error {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	err = DB.AutoMigrate(&models.Account{}, &models.Transfer{}, &models.File{}, &models.Settings{})
	if err != nil {
		return err
	}
	if err := removeAccountBalanceColumn(); err != nil {
		return err
	}

	if err := ensurePanelPassword(); err != nil {
		return err
	}

	log.Println("Database initialized successfully")
	return nil
}

func removeAccountBalanceColumn() error {
	if !DB.Migrator().HasColumn(&models.Account{}, "balance") {
		return nil
	}

	return DB.Migrator().DropColumn(&models.Account{}, "balance")
}

func ensurePanelPassword() error {
	var settings models.Settings
	err := DB.Where("key = ?", "panel_password").First(&settings).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		password := os.Getenv("PANEL_PASSWORD")
		if password == "" {
			var tokenErr error
			password, tokenErr = security.RandomToken(18)
			if tokenErr != nil {
				return tokenErr
			}
			log.Printf("PANEL_PASSWORD is not set; generated initial panel password: %s", password)
		}

		hash, err := security.HashPassword(password)
		if err != nil {
			return err
		}
		return DB.Create(&models.Settings{Key: "panel_password", Value: hash}).Error
	}
	if err != nil {
		return err
	}

	if security.IsPasswordHash(settings.Value) {
		return nil
	}

	hash, err := security.HashPassword(settings.Value)
	if err != nil {
		return err
	}
	settings.Value = hash
	return DB.Save(&settings).Error
}
