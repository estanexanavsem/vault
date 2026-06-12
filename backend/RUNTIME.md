# Runtime Configuration

This backend is configured through environment variables. Production runs should set
values explicitly instead of relying on local defaults.

## Required Values

- `PANEL_PASSWORD`: Initial admin panel password used when the database does not yet
  contain a `panel_password` setting.
- `CORS_ORIGINS`: Comma-separated browser origins allowed to call the API, for
  example `https://admin.example.com,https://guest.example.com`.

## Core Values

- `PORT`: HTTP listen port. Default: `8080`.
- `DB_PATH`: SQLite database path. Default: `./data/vault.db`.
- `GIN_MODE`: Gin mode. Use `release` outside local development.

## HTTP Server Timeouts

Durations use Go syntax such as `5s`, `30s`, or `2m`.

- `HTTP_READ_HEADER_TIMEOUT`: Time allowed to read request headers. Default: `5s`.
- `HTTP_READ_TIMEOUT`: Time allowed to read the full request. Default: `15s`.
- `HTTP_WRITE_TIMEOUT`: Time allowed to write the response. Default: `30s`.
- `HTTP_IDLE_TIMEOUT`: Keep-alive idle timeout. Default: `60s`.
- `HTTP_SHUTDOWN_TIMEOUT`: Graceful shutdown timeout after `SIGINT` or `SIGTERM`.
  Default: `10s`.

Invalid or non-positive timeout values are ignored and the default is used.

## Health Endpoints

- `GET /health`: Liveness check. Returns `200` when the process is serving HTTP.
- `GET /ready`: Readiness check. Returns `200` only when the database connection
  can be opened and pinged; otherwise returns `503`.
