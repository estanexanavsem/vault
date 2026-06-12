package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"vault/config"
	"vault/models"
)

type accountResponse struct {
	ID              uint       `json:"id"`
	Login           string     `json:"login"`
	HolderName      string     `json:"holder_name"`
	AccountName     string     `json:"account_name"`
	FullAccountName string     `json:"full_account_name"`
	AccountNumber   string     `json:"account_number"`
	RoutingNumber   string     `json:"routing_number"`
	Email           string     `json:"email"`
	Phone           string     `json:"phone"`
	Balance         float64    `json:"balance"`
	LastSignInAt    *time.Time `json:"last_sign_in_at,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type fileResponse struct {
	ID          uint      `json:"id"`
	AccountID   uint      `json:"account_id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Size        int64     `json:"size"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

func parseIDParam(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return 0, false
	}
	return uint(id), true
}

func accountToResponse(account models.Account) accountResponse {
	return accountResponse{
		ID:              account.ID,
		Login:           account.Login,
		HolderName:      account.HolderName,
		AccountName:     account.AccountName,
		FullAccountName: account.FullAccountName,
		AccountNumber:   account.AccountNumber,
		RoutingNumber:   account.RoutingNumber,
		Email:           account.Email,
		Phone:           account.Phone,
		Balance:         account.Balance,
		LastSignInAt:    account.LastSignInAt,
		CreatedAt:       account.CreatedAt,
		UpdatedAt:       account.UpdatedAt,
	}
}

func accountsToResponse(accounts []models.Account) []accountResponse {
	responses := make([]accountResponse, len(accounts))
	for i, account := range accounts {
		responses[i] = accountToResponse(account)
	}
	return responses
}

func fileToResponse(file models.File) fileResponse {
	return fileResponse{
		ID:          file.ID,
		AccountID:   file.AccountID,
		Name:        file.Name,
		Type:        file.Type,
		Size:        file.Size,
		Description: file.Description,
		CreatedAt:   file.CreatedAt,
	}
}

func filesToResponse(files []models.File) []fileResponse {
	responses := make([]fileResponse, len(files))
	for i, file := range files {
		responses[i] = fileToResponse(file)
	}
	return responses
}

func ensureAccountExists(accountID uint) error {
	var account models.Account
	return config.DB.Select("id").First(&account, accountID).Error
}

func respondDBError(c *gin.Context, err error) {
	if err == nil {
		return
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
}
