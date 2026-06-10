GO ?= go
PORT ?= 8080
DB_PATH ?= ./data/vault.db
GOFILES := $(shell find . -name '*.go' -not -path './.codegraph/*')

.DEFAULT_GOAL := help

.PHONY: help fmt fmt-check tidy test vet check build run dev

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  help       Show this help message"
	@echo "  fmt        Format Go files with gofmt"
	@echo "  fmt-check  Verify Go files are gofmt-formatted"
	@echo "  tidy       Synchronize go.mod and go.sum"
	@echo "  test       Run Go tests"
	@echo "  vet        Run go vet"
	@echo "  check      Run fmt-check, vet, and test"
	@echo "  build      Build all packages"
	@echo "  run        Run the server in release mode (PORT=$(PORT), DB_PATH=$(DB_PATH))"
	@echo "  dev        Run the server in debug mode (PORT=$(PORT), DB_PATH=$(DB_PATH))"

fmt:
	gofmt -w $(GOFILES)

fmt-check:
	@files="$$(gofmt -l $(GOFILES))"; \
	if [ -n "$$files" ]; then \
		echo "Files need gofmt:"; \
		echo "$$files"; \
		exit 1; \
	fi

tidy:
	$(GO) mod tidy

test:
	$(GO) test ./...

vet:
	$(GO) vet ./...

check: fmt-check vet test

build:
	$(GO) build ./...

run:
	GIN_MODE=release DB_PATH=$(DB_PATH) PORT=$(PORT) $(GO) run .

dev:
	GIN_MODE=debug DB_PATH=$(DB_PATH) PORT=$(PORT) $(GO) run .
