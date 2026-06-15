.DEFAULT_GOAL := help

.PHONY: help dev deploy provision release check collections status logs

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  dev             Start local API, admin, and guest dev servers"
	@echo "  deploy          Open interactive deploy TUI"
	@echo "  provision       Provision VPS via Ansible"
	@echo "  release         Build and deploy current release"
	@echo "  check           Run Ansible syntax checks"
	@echo "  collections     Install Ansible Galaxy collections"
	@echo "  status          Show remote service status"
	@echo "  logs            Show remote service logs"

dev:
	@echo "Starting local dev servers:"
	@echo "  API:   http://localhost:8080"
	@echo "  Admin: http://localhost:3001"
	@echo "  Guest: http://localhost:3002"
	@set -e; \
	pids=""; \
	trap 'status=$$?; for pid in $$pids; do kill "$$pid" 2>/dev/null || true; done; wait; exit $$status' INT TERM EXIT; \
	( cd backend && make dev ) & pids="$$pids $$!"; \
	( cd frontend/admin && npm run dev ) & pids="$$pids $$!"; \
	( cd frontend/guest && npm run dev ) & pids="$$pids $$!"; \
	wait

deploy:
	./scripts/deploy.sh

provision:
	./scripts/deploy.sh provision

release:
	./scripts/deploy.sh deploy

check:
	./scripts/deploy.sh check

collections:
	./scripts/deploy.sh collections

status:
	./scripts/deploy.sh status

logs:
	./scripts/deploy.sh logs
