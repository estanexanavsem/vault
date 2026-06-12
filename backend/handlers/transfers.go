package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"vault/config"
	"vault/models"
)

type createTransferRequest struct {
	AccountID       uint       `json:"account_id"`
	FromAccount     string     `json:"from_account"`
	ToAccount       string     `json:"to_account"`
	Amount          float64    `json:"amount"`
	Description     string     `json:"description"`
	FullDescription string     `json:"full_description"`
	Category        string     `json:"category"`
	Reference       string     `json:"reference"`
	TransferType    string     `json:"transfer_type"`
	Status          string     `json:"status"`
	TransactionDate *time.Time `json:"transaction_date"`
}

type updateTransferRequest struct {
	AccountID       *uint      `json:"account_id"`
	FromAccount     *string    `json:"from_account"`
	ToAccount       *string    `json:"to_account"`
	Amount          *float64   `json:"amount"`
	Description     *string    `json:"description"`
	FullDescription *string    `json:"full_description"`
	Category        *string    `json:"category"`
	Reference       *string    `json:"reference"`
	TransferType    *string    `json:"transfer_type"`
	Status          *string    `json:"status"`
	TransactionDate *time.Time `json:"transaction_date"`
}

func ListTransfers(c *gin.Context) {
	var transfers []models.Transfer
	if err := config.DB.Find(&transfers).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, transfers)
}

func GetTransfer(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var transfer models.Transfer
	if err := config.DB.First(&transfer, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, transfer)
}

func CreateTransfer(c *gin.Context) {
	var req createTransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request")
		return
	}
	if req.AccountID == 0 {
		respondBadRequest(c, "account_id required")
		return
	}
	if req.Amount < 0 {
		respondBadRequest(c, "amount cannot be negative")
		return
	}
	if err := ensureAccountExists(req.AccountID); err != nil {
		respondDBError(c, err)
		return
	}

	transactionDate := time.Now()
	if req.TransactionDate != nil {
		transactionDate = *req.TransactionDate
	}
	transfer := models.Transfer{
		AccountID:       req.AccountID,
		FromAccount:     req.FromAccount,
		ToAccount:       req.ToAccount,
		Amount:          req.Amount,
		Description:     req.Description,
		FullDescription: req.FullDescription,
		Category:        req.Category,
		Reference:       req.Reference,
		TransferType:    req.TransferType,
		Status:          req.Status,
		TransactionDate: transactionDate,
	}
	if err := config.DB.Create(&transfer).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusCreated, transfer)
}

func UpdateTransfer(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var transfer models.Transfer
	if err := config.DB.First(&transfer, id).Error; err != nil {
		respondDBError(c, err)
		return
	}

	var req updateTransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request")
		return
	}
	if req.AccountID != nil {
		if *req.AccountID == 0 {
			respondBadRequest(c, "account_id cannot be zero")
			return
		}
		if err := ensureAccountExists(*req.AccountID); err != nil {
			respondDBError(c, err)
			return
		}
		transfer.AccountID = *req.AccountID
	}
	applyStringUpdate(&transfer.FromAccount, req.FromAccount)
	applyStringUpdate(&transfer.ToAccount, req.ToAccount)
	if req.Amount != nil {
		if *req.Amount < 0 {
			respondBadRequest(c, "amount cannot be negative")
			return
		}
		transfer.Amount = *req.Amount
	}
	applyStringUpdate(&transfer.Description, req.Description)
	applyStringUpdate(&transfer.FullDescription, req.FullDescription)
	applyStringUpdate(&transfer.Category, req.Category)
	applyStringUpdate(&transfer.Reference, req.Reference)
	applyStringUpdate(&transfer.TransferType, req.TransferType)
	applyStringUpdate(&transfer.Status, req.Status)
	if req.TransactionDate != nil {
		transfer.TransactionDate = *req.TransactionDate
	}

	if err := config.DB.Save(&transfer).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, transfer)
}

func DeleteTransfer(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	respondDeleted(c, &models.Transfer{}, id)
}
