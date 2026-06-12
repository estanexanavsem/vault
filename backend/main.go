package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"vault/config"
	"vault/handlers"
	"vault/middleware"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	return runWithServer(func(r *gin.Engine, addr string) error {
		return r.Run(addr)
	})
}

func runWithServer(start func(*gin.Engine, string) error) error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/vault.db"
	}

	if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
		return err
	}

	if err := config.InitDB(dbPath); err != nil {
		return err
	}

	r := newRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Vault server starting on :%s", port)
	return start(r, ":"+port)
}

func newRouter() *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 10 << 20

	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsOrigins(),
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.POST("/panel/login", middleware.CheckPanelPassword())

		guest := api.Group("/guest")
		{
			guest.POST("/login", handlers.GuestLogin)
			guest.GET("/session", handlers.GuestSession)
			guest.PUT("/profile", handlers.GuestUpdateProfile)
			guest.POST("/logout", handlers.GuestLogout)
		}

		protected := api.Group("")
		protected.Use(middleware.PanelAuth())
		{
			protected.GET("/panel/session", func(c *gin.Context) {
				c.JSON(200, gin.H{"success": true})
			})
			protected.POST("/panel/logout", middleware.LogoutPanel())

			protected.GET("/accounts", handlers.ListAccounts)
			protected.GET("/accounts/:id", handlers.GetAccount)
			protected.POST("/accounts", handlers.CreateAccount)
			protected.PUT("/accounts/:id", handlers.UpdateAccount)
			protected.DELETE("/accounts/:id", handlers.DeleteAccount)

			protected.GET("/transfers", handlers.ListTransfers)
			protected.GET("/transfers/:id", handlers.GetTransfer)
			protected.POST("/transfers", handlers.CreateTransfer)
			protected.PUT("/transfers/:id", handlers.UpdateTransfer)
			protected.DELETE("/transfers/:id", handlers.DeleteTransfer)

			protected.GET("/files", handlers.ListFiles)
			protected.GET("/files/:id", handlers.GetFile)
			protected.POST("/files", handlers.UploadFile)
			protected.PUT("/files/:id", handlers.UpdateFile)
			protected.DELETE("/files/:id", handlers.DeleteFile)

			protected.GET("/settings", handlers.GetSettings)
			protected.PUT("/settings", handlers.UpdateSettings)
		}
	}
	return r
}

func corsOrigins() []string {
	raw := os.Getenv("CORS_ORIGINS")
	if raw == "" {
		return []string{
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
			"http://127.0.0.1:3002",
			"http://127.0.0.1:5173",
		}
	}

	parts := strings.Split(raw, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin != "" {
			origins = append(origins, origin)
		}
	}
	return origins
}
