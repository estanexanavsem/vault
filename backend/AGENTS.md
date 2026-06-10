# Repository Guidelines

## Project Structure & Module Organization

This repository is a Go backend service for a vault-style API. The entry point is `main.go`, which wires Gin routes, CORS, database initialization, and server startup.

- `config/` contains database setup and migration bootstrapping.
- `models/` defines GORM models.
- `handlers/` contains HTTP handlers by resource: accounts, transfers, files, guest access, settings, plus shared helpers.
- `middleware/` contains request middleware such as panel authentication.
- `security/` contains password and token helpers.
- Tests live next to the code as `*_test.go`, currently in `handlers/` and `middleware/`.
- Runtime local data is stored under `data/` and is ignored by git.

## Build, Test, and Development Commands

Use the `Makefile` targets as the primary workflow:

- `make` or `make help`: show available targets.
- `make fmt`: format Go files with `gofmt`.
- `make fmt-check`: fail if any Go file is not formatted.
- `make test`: run `go test ./...`.
- `make vet`: run `go vet ./...`.
- `make check`: run formatting check, vet, and tests.
- `make build`: compile all packages.
- `make run`: start the server in release mode with `DB_PATH` and `PORT`.
- `make dev`: start the server in Gin debug mode.

Example: `PORT=9090 DB_PATH=./data/dev.db make dev`.

## Coding Style & Naming Conventions

Follow standard Go conventions: tabs from `gofmt`, short package names, exported identifiers only when needed outside the package, and explicit error handling. Keep handlers small and resource-oriented. Prefer request/response DTO structs over binding directly into GORM models.

## Testing Guidelines

Use Go's standard `testing` package. Name tests `TestXxx` and place them in the package they exercise. Add focused tests for handler behavior, middleware auth paths, validation errors, and database edge cases. Run `make check` before submitting changes.

## Commit & Pull Request Guidelines

Use Conventional Commits strictly for every commit, such as `test(accounts): add validation coverage` or `chore(deps): update gorm dependencies`. Keep commits scoped to one behavior change when practical. Pull requests should include a short summary, validation commands run, linked issue if any, and notes about schema/configuration changes.

## Configuration Notes

Key environment variables are `PORT`, `DB_PATH`, `GIN_MODE`, `CORS_ORIGINS`, and `PANEL_PASSWORD`. Do not commit local databases or `.env` files.
