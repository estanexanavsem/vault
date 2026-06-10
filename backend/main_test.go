package main

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCorsOriginsDefaultsAndEnvOverride(t *testing.T) {
	t.Setenv("CORS_ORIGINS", "")

	defaults := corsOrigins()
	wantDefaults := []string{
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:3002",
		"http://localhost:5173",
		"http://127.0.0.1:3000",
		"http://127.0.0.1:3001",
		"http://127.0.0.1:3002",
		"http://127.0.0.1:5173",
	}
	if !reflect.DeepEqual(defaults, wantDefaults) {
		t.Fatalf("default origins mismatch: got %#v want %#v", defaults, wantDefaults)
	}

	t.Setenv("CORS_ORIGINS", " https://app.example.com, ,http://localhost:3000 ")
	wantCustom := []string{"https://app.example.com", "http://localhost:3000"}
	if got := corsOrigins(); !reflect.DeepEqual(got, wantCustom) {
		t.Fatalf("custom origins mismatch: got %#v want %#v", got, wantCustom)
	}
}

func TestNewRouterHealthAndCors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Setenv("CORS_ORIGINS", "https://app.example.com")

	router := newRouter()

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	req.Header.Set("Origin", "https://app.example.com")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	if got := resp.Header().Get("Access-Control-Allow-Origin"); got != "https://app.example.com" {
		t.Fatalf("unexpected cors origin header: %q", got)
	}
	if resp.Body.String() != `{"status":"ok"}` {
		t.Fatalf("unexpected health body: %s", resp.Body.String())
	}
}

func TestRunReturnsDirectoryCreationError(t *testing.T) {
	t.Setenv("DB_PATH", "/dev/null/vault.db")

	if err := run(); err == nil {
		t.Fatal("expected run to fail when DB_PATH parent is not a directory")
	}
}

func TestRunWithServerInitializesDBAndUsesPort(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Setenv("DB_PATH", t.TempDir()+"/vault.db")
	t.Setenv("PORT", "9090")
	t.Setenv("PANEL_PASSWORD", "panel-secret")

	called := false
	err := runWithServer(func(r *gin.Engine, addr string) error {
		called = true
		if addr != ":9090" {
			t.Fatalf("unexpected listen addr: %q", addr)
		}
		req := httptest.NewRequest(http.MethodGet, "/health", nil)
		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)
		if resp.Code != http.StatusOK {
			t.Fatalf("health route not available: %d %s", resp.Code, resp.Body.String())
		}
		return nil
	})
	if err != nil {
		t.Fatalf("run with server: %v", err)
	}
	if !called {
		t.Fatal("expected start function to be called")
	}
}

func TestRunWithServerReturnsStartError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Setenv("DB_PATH", t.TempDir()+"/vault.db")
	t.Setenv("PORT", "")
	t.Setenv("PANEL_PASSWORD", "panel-secret")

	wantErr := errors.New("listen failed")
	err := runWithServer(func(_ *gin.Engine, addr string) error {
		if addr != ":8080" {
			t.Fatalf("unexpected default listen addr: %q", addr)
		}
		return wantErr
	})
	if !errors.Is(err, wantErr) {
		t.Fatalf("expected start error, got %v", err)
	}
}
