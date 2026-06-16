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
	Login           string `json:"login"`
	Password        string `json:"password"`
	HolderName      string `json:"holder_name"`
	AccountName     string `json:"account_name"`
	FullAccountName string `json:"full_account_name"`
	AccountNumber   string `json:"account_number"`
	RoutingNumber   string `json:"routing_number"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
}

type updateAccountRequest struct {
	Login           *string `json:"login"`
	Password        *string `json:"password"`
	HolderName      *string `json:"holder_name"`
	AccountName     *string `json:"account_name"`
	FullAccountName *string `json:"full_account_name"`
	AccountNumber   *string `json:"account_number"`
	RoutingNumber   *string `json:"routing_number"`
	Email           *string `json:"email"`
	Phone           *string `json:"phone"`
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
		respondBadRequest(c, "invalid request")
		return
	}
	req.Login = strings.TrimSpace(req.Login)
	if req.Login == "" || req.Password == "" {
		respondBadRequest(c, "login and password required")
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
		respondBadRequest(c, "invalid request")
		return
	}
	if req.Login != nil {
		account.Login = strings.TrimSpace(*req.Login)
		if account.Login == "" {
			respondBadRequest(c, "login cannot be empty")
			return
		}
	}
	if req.Password != nil {
		if *req.Password == "" {
			respondBadRequest(c, "password cannot be empty")
			return
		}
		hash, err := security.HashPassword(*req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
			return
		}
		account.Password = hash
	}
	applyStringUpdate(&account.HolderName, req.HolderName)
	applyStringUpdate(&account.AccountName, req.AccountName)
	applyStringUpdate(&account.FullAccountName, req.FullAccountName)
	applyStringUpdate(&account.AccountNumber, req.AccountNumber)
	applyStringUpdate(&account.RoutingNumber, req.RoutingNumber)
	applyStringUpdate(&account.Email, req.Email)
	applyStringUpdate(&account.Phone, req.Phone)

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

	respondDeleted(c, &models.Account{}, id)
}
