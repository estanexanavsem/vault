package handlers

import (
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"vault/config"
	"vault/models"
)

const maxUploadSize = 10 << 20

type createFileRequest struct {
	AccountID   uint   `json:"account_id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
}

type updateFileRequest struct {
	AccountID   *uint   `json:"account_id"`
	Name        *string `json:"name"`
	Type        *string `json:"type"`
	Description *string `json:"description"`
}

func ListFiles(c *gin.Context) {
	var files []models.File
	if err := config.DB.Omit("data").Find(&files).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, filesToResponse(files))
}

func GetFile(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var file models.File
	if err := config.DB.First(&file, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	contentType := file.Type
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("Content-Disposition", fmt.Sprintf(`inline; filename="%s"`, safeHeaderFilename(file.Name)))
	c.Data(http.StatusOK, contentType, file.Data)
}

func CreateFile(c *gin.Context) {
	var req createFileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.AccountID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "account_id required"})
		return
	}
	if err := ensureAccountExists(req.AccountID); err != nil {
		respondDBError(c, err)
		return
	}

	file := models.File{
		AccountID:   req.AccountID,
		Name:        filepath.Base(req.Name),
		Type:        req.Type,
		Description: req.Description,
	}
	if err := config.DB.Create(&file).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusCreated, fileToResponse(file))
}

func UpdateFile(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	var file models.File
	if err := config.DB.First(&file, id).Error; err != nil {
		respondDBError(c, err)
		return
	}

	var req updateFileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.AccountID != nil {
		if *req.AccountID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "account_id cannot be zero"})
			return
		}
		if err := ensureAccountExists(*req.AccountID); err != nil {
			respondDBError(c, err)
			return
		}
		file.AccountID = *req.AccountID
	}
	if req.Name != nil {
		file.Name = filepath.Base(*req.Name)
	}
	if req.Type != nil {
		file.Type = *req.Type
	}
	if req.Description != nil {
		file.Description = *req.Description
	}

	if err := config.DB.Save(&file).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, fileToResponse(file))
}

func DeleteFile(c *gin.Context) {
	id, ok := parseIDParam(c)
	if !ok {
		return
	}

	result := config.DB.Delete(&models.File{}, id)
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

func UploadFile(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxUploadSize+(1<<20))

	file, err := c.FormFile("file")
	if err != nil {
		if strings.Contains(err.Error(), "request body too large") {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file too large"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploaded"})
		return
	}
	if file.Size > maxUploadSize {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file too large"})
		return
	}

	accountID, err := strconv.ParseUint(c.PostForm("account_id"), 10, 0)
	if err != nil || accountID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "account_id required"})
		return
	}
	if err := ensureAccountExists(uint(accountID)); err != nil {
		respondDBError(c, err)
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer f.Close()

	data, err := io.ReadAll(io.LimitReader(f, maxUploadSize+1))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if int64(len(data)) > maxUploadSize {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file too large"})
		return
	}

	name := filepath.Base(file.Filename)
	if name == "." || name == string(filepath.Separator) || name == "" {
		name = "upload"
	}
	contentType := "application/octet-stream"
	if len(data) > 0 {
		contentType = http.DetectContentType(data)
	}

	newFile := models.File{
		AccountID:   uint(accountID),
		Name:        name,
		Type:        contentType,
		Size:        int64(len(data)),
		Data:        data,
		Description: c.PostForm("description"),
	}
	if err := config.DB.Create(&newFile).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusCreated, fileToResponse(newFile))
}

func safeHeaderFilename(name string) string {
	name = filepath.Base(name)
	name = strings.ReplaceAll(name, `"`, "")
	name = strings.ReplaceAll(name, "\r", "")
	name = strings.ReplaceAll(name, "\n", "")
	if name == "." || name == ".." || name == string(filepath.Separator) || name == "" {
		return "download"
	}
	return name
}
