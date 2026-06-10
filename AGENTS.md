# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Go API backend and two Vite React frontends.

- `backend/`: Gin/GORM service. `main.go` wires routes, CORS, database setup, and startup. Code lives in `handlers/`, `config/`, `models/`, `middleware/`, and `security/`.
- `frontend/admin/`: `vault-admin` React app. `src/` contains components, services, stores, hooks, forms, types, utilities, styles, and theme setup.
- `frontend/guest/`: smaller guest-facing React app under `src/`.
- Backend tests are colocated as `*_test.go`. Frontend builds output to `dist/`; do not edit generated files.

Nested guides in `backend/AGENTS.md` and `frontend/admin/AGENTS.md` provide area-specific rules.

## Build, Test, and Development Commands

Backend commands run from `backend/`:

- `make dev`: start the API in debug mode; defaults are `PORT=8080` and `DB_PATH=./data/vault.db`.
- `make run`: start the API in release mode.
- `make fmt`, `make fmt-check`: format or verify Go with `gofmt`.
- `make test`, `make vet`, `make check`: run tests, vetting, or full validation.
- `make build`: compile all Go packages.

Frontend commands run from each app directory:

- `npm install`: install dependencies.
- `npm run dev`: start Vite (`3001` for admin, `3002` for guest).
- `npm run build`: compile TypeScript and produce a production build.
- Admin only: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.

## Coding Style & Naming Conventions

Use standard Go style: `gofmt`, short package names, explicit error handling, and focused handlers. For React, use TypeScript, PascalCase component files such as `AccountTable.tsx`, and camelCase for hooks, services, stores, utilities, and forms. Prefer named exports for shared frontend code. Admin ESLint enforces type-aware TypeScript, React Hooks, `no-console`, and inline type-import rules.

## Testing Guidelines

Run `make check` before backend changes. Add focused Go tests for handlers, middleware, validation, database behavior, and security helpers. Frontend tests are not configured; for UI changes run `npm run build`, plus admin lint/format checks in `frontend/admin/`.
Do not use Playwright for visual verification. Visual review and screenshot-based validation are handled by the user.

## Commit & Pull Request Guidelines

Use Conventional Commits strictly for every commit, such as `feat(guest): add file download view` or `fix(auth): validate panel password`. Keep commits scoped to one behavior change when practical. Pull requests should include a summary, linked issue or task, validation commands, and screenshots for visible UI changes. Call out schema, environment, proxy, or authentication changes.

## Security & Configuration Tips

Do not commit local databases, secrets, or `.env` files. Backend configuration uses `PORT`, `DB_PATH`, `GIN_MODE`, `CORS_ORIGINS`, and `PANEL_PASSWORD`. Keep frontend API traffic in service clients unless a change requires otherwise.
