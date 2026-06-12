.DEFAULT_GOAL := help

.PHONY: help deploy provision release check collections status logs

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  deploy          Open interactive deploy TUI"
	@echo "  provision       Provision VPS via Ansible"
	@echo "  release         Build and deploy current release"
	@echo "  check           Run Ansible syntax checks"
	@echo "  collections     Install Ansible Galaxy collections"
	@echo "  status          Show remote service status"
	@echo "  logs            Show remote service logs"

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
