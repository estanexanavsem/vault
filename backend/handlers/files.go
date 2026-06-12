package handlers

import (
	"fmt"
	"io"
	"net/http"
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
		respondBadRequest(c, "invalid request")
		return
	}
	if req.AccountID == 0 {
		respondBadRequest(c, "account_id required")
		return
	}
	if err := ensureAccountExists(req.AccountID); err != nil {
		respondDBError(c, err)
		return
	}

	file := models.File{
		AccountID:   req.AccountID,
		Name:        sanitizedFilename(req.Name, "download"),
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
		file.AccountID = *req.AccountID
	}
	if req.Name != nil {
		file.Name = sanitizedFilename(*req.Name, "download")
	}
	applyStringUpdate(&file.Type, req.Type)
	applyStringUpdate(&file.Description, req.Description)

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

	respondDeleted(c, &models.File{}, id)
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not open file"})
		return
	}
	defer f.Close()

	data, err := io.ReadAll(io.LimitReader(f, maxUploadSize+1))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read file"})
		return
	}
	if int64(len(data)) > maxUploadSize {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file too large"})
		return
	}

	name := sanitizedFilename(file.Filename, "upload")
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
	return sanitizedFilename(name, "download")
}
