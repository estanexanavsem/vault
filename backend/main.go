package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

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
	return runWithServer(startHTTPServer)
}

func runWithServer(start func(*http.Server) error) error {
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

	addr := os.Getenv("HTTP_ADDR")
	if addr == "" {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		addr = ":" + port
	}

	log.Printf("Vault server starting on %s", addr)
	return start(newHTTPServer(addr, r))
}

func newHTTPServer(addr string, handler http.Handler) *http.Server {
	return &http.Server{
		Addr:              addr,
		Handler:           handler,
		ReadHeaderTimeout: envDuration("HTTP_READ_HEADER_TIMEOUT", 5*time.Second),
		ReadTimeout:       envDuration("HTTP_READ_TIMEOUT", 15*time.Second),
		WriteTimeout:      envDuration("HTTP_WRITE_TIMEOUT", 30*time.Second),
		IdleTimeout:       envDuration("HTTP_IDLE_TIMEOUT", 60*time.Second),
	}
}

func startHTTPServer(srv *http.Server) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	errCh := make(chan error, 1)
	go func() {
		errCh <- srv.ListenAndServe()
	}()

	select {
	case err := <-errCh:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		stop()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), envDuration("HTTP_SHUTDOWN_TIMEOUT", 10*time.Second))
		defer cancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			return err
		}
		err := <-errCh
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	}
}

func envDuration(name string, fallback time.Duration) time.Duration {
	raw := strings.TrimSpace(os.Getenv(name))
	if raw == "" {
		return fallback
	}

	duration, err := time.ParseDuration(raw)
	if err != nil || duration <= 0 {
		log.Printf("Ignoring invalid %s=%q; using %s", name, raw, fallback)
		return fallback
	}
	return duration
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
	r.GET("/ready", func(c *gin.Context) {
		if err := databaseReady(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": "error", "database": "unavailable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok", "database": "ok"})
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
			protected.DELETE("/settings/transfer-categories/:category", handlers.DeleteTransferCategory)
		}
	}
	return r
}

func databaseReady() error {
	if config.DB == nil {
		return errors.New("database is not initialized")
	}

	sqlDB, err := config.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
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
