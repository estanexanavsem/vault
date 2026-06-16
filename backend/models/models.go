package models

import (
	"time"
)

type Account struct {
	ID              uint       `json:"id" gorm:"primaryKey"`
	Login           string     `json:"login" gorm:"uniqueIndex;not null"`
	Password        string     `json:"-" gorm:"not null"`
	HolderName      string     `json:"holder_name"`
	AccountName     string     `json:"account_name"`
	FullAccountName string     `json:"full_account_name"`
	AccountNumber   string     `json:"account_number"`
	RoutingNumber   string     `json:"routing_number"`
	Email           string     `json:"email"`
	Phone           string     `json:"phone"`
	LastSignInAt    *time.Time `json:"last_sign_in_at,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type Transfer struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	AccountID       uint      `json:"account_id" gorm:"not null;index"`
	FromAccount     string    `json:"from_account"`
	ToAccount       string    `json:"to_account"`
	Amount          float64   `json:"amount"`
	Description     string    `json:"description"`
	FullDescription string    `json:"full_description"`
	Category        string    `json:"category"`
	Reference       string    `json:"reference"`
	TransferType    string    `json:"transfer_type"`
	Status          string    `json:"status"`
	TransactionDate time.Time `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
}

type File struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AccountID   uint      `json:"account_id" gorm:"not null;index"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Size        int64     `json:"size"`
	Data        []byte    `json:"-" gorm:"type:blob"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type Settings struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Key   string `json:"key" gorm:"uniqueIndex;not null"`
	Value string `json:"value"`
}
