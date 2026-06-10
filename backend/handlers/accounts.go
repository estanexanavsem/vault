package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"vault/config"
	"vault/models"
	"vault/security"
)

type createAccountRequest struct {
	Login           string  `json:"login"`
	Password        string  `json:"password"`
	HolderName      string  `json:"holder_name"`
	AccountName     string  `json:"account_name"`
	FullAccountName string  `json:"full_account_name"`
	AccountNumber   string  `json:"account_number"`
	RoutingNumber   string  `json:"routing_number"`
	Email           string  `json:"email"`
	Phone           string  `json:"phone"`
	Balance         float64 `json:"balance"`
}

type updateAccountRequest struct {
	Login           *string  `json:"login"`
	Password        *string  `json:"password"`
	HolderName      *string  `json:"holder_name"`
	AccountName     *string  `json:"account_name"`
	FullAccountName *string  `json:"full_account_name"`
	AccountNumber   *string  `json:"account_number"`
	RoutingNumber   *string  `json:"routing_number"`
	Email           *string  `json:"email"`
	Phone           *string  `json:"phone"`
	Balance         *float64 `json:"balance"`
}

func ListAccounts(c *gin.Context) {
	var accounts []models.Account
	if err := config.DB.Find(&accounts).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, accountsToResponse(accounts))
}

func GetAccount(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var account models.Account
	if err := config.DB.First(&account, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, accountToResponse(account))
}

func CreateAccount(c *gin.Context) {
	var req createAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.Login = strings.TrimSpace(req.Login)
	if req.Login == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "login and password required"})
		return
	}

	hash, err := security.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
		return
	}

	account := models.Account{
		Login:           req.Login,
		Password:        hash,
		HolderName:      req.HolderName,
		AccountName:     req.AccountName,
		FullAccountName: req.FullAccountName,
		AccountNumber:   req.AccountNumber,
		RoutingNumber:   req.RoutingNumber,
		Email:           req.Email,
		Phone:           req.Phone,
		Balance:         req.Balance,
	}
	if err := config.DB.Create(&account).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusCreated, accountToResponse(account))
}

func UpdateAccount(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var account models.Account
	if err := config.DB.First(&account, id).Error; err != nil {
		respondDBError(c, err)
		return
	}

	var req updateAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Login != nil {
		account.Login = strings.TrimSpace(*req.Login)
		if account.Login == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "login cannot be empty"})
			return
		}
	}
	if req.Password != nil {
		if *req.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "password cannot be empty"})
			return
		}
		hash, err := security.HashPassword(*req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
			return
		}
		account.Password = hash
	}
	if req.HolderName != nil {
		account.HolderName = *req.HolderName
	}
	if req.AccountName != nil {
		account.AccountName = *req.AccountName
	}
	if req.FullAccountName != nil {
		account.FullAccountName = *req.FullAccountName
	}
	if req.AccountNumber != nil {
		account.AccountNumber = *req.AccountNumber
	}
	if req.RoutingNumber != nil {
		account.RoutingNumber = *req.RoutingNumber
	}
	if req.Email != nil {
		account.Email = *req.Email
	}
	if req.Phone != nil {
		account.Phone = *req.Phone
	}
	if req.Balance != nil {
		account.Balance = *req.Balance
	}

	if err := config.DB.Save(&account).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, accountToResponse(account))
}

func DeleteAccount(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	result := config.DB.Delete(&models.Account{}, id)
	if result.Error != nil {
		respondDBError(c, result.Error)
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
