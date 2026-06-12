#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANSIBLE_DIR="$ROOT_DIR/ansible"
INVENTORY_FILE="$ANSIBLE_DIR/inventory.ini"
VARS_FILE="$ANSIBLE_DIR/group_vars/vault.yml"
EXAMPLE_INVENTORY="$ANSIBLE_DIR/inventory.example.ini"
EXAMPLE_VARS="$ANSIBLE_DIR/group_vars/vault.example.yml"
export ANSIBLE_CONFIG="$ANSIBLE_DIR/ansible.cfg"

require_cmd() {
	local cmd="$1"
	if ! command -v "$cmd" >/dev/null 2>&1; then
		gum style --foreground 196 "Missing required command: $cmd"
		if [[ "$cmd" == "gum" ]]; then
			cat <<'EOF'
Install gum on Debian/Ubuntu:

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg
echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list
sudo apt update && sudo apt install gum
EOF
		fi
		exit 1
	fi
}

require_gum_first() {
	if ! command -v gum >/dev/null 2>&1; then
		echo "Missing required command: gum"
		cat <<'EOF'
Install gum on Debian/Ubuntu:

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg
echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list
sudo apt update && sudo apt install gum
EOF
		exit 1
	fi
}

random_key() {
	head -c32 /dev/urandom | base64
}

is_interactive() {
	[[ -t 0 && -t 1 ]]
}

confirm_or_yes() {
	local prompt="$1"
	local default="${2:-false}"
	if is_interactive; then
		gum confirm "$prompt" --default="$default"
	else
		gum style --foreground 214 "Non-interactive shell: proceeding with '$prompt'"
		return 0
	fi
}

ask_required() {
	local prompt="$1"
	local value="${2:-}"
	while [[ -z "$value" ]]; do
		value="$(gum input --prompt "$prompt " --value "$value" --char-limit 256)"
	done
	printf '%s\n' "$value"
}

ask_secret() {
	local prompt="$1"
	local value=""
	while [[ -z "$value" ]]; do
		value="$(gum input --password --prompt "$prompt " --char-limit 256)"
	done
	printf '%s\n' "$value"
}

ensure_local_tools() {
	require_cmd ansible
	require_cmd ansible-playbook
	require_cmd ansible-galaxy
	require_cmd rsync
	require_cmd go
	require_cmd npm
}

config_exists() {
	[[ -f "$INVENTORY_FILE" && -f "$VARS_FILE" ]]
}

setup_config() {
	gum style --border normal --padding "0 1" "Vault VPS deploy configuration"

	if config_exists && ! gum confirm "Overwrite existing ansible/inventory.ini and ansible/group_vars/vault.yml?" --default=false; then
		return 0
	fi

	local host user port key domain_root admin_domain guest_domain api_domain deploy_domain
	local panel_password semaphore_password semaphore_email target_arch

	host="$(ask_required "VPS host/IP:" "203.0.113.10")"
	user="$(ask_required "SSH user:" "root")"
	port="$(ask_required "SSH port:" "22")"
	key="$(gum input --prompt "SSH private key path (optional): " --char-limit 256)"

	domain_root="$(ask_required "Base domain:" "example.com")"
	admin_domain="$(ask_required "Admin domain:" "admin.${domain_root}")"
	guest_domain="$(ask_required "Guest domain:" "guest.${domain_root}")"
	api_domain="$(ask_required "API domain:" "api.${domain_root}")"
	deploy_domain="$(ask_required "Deploy dashboard domain:" "deploy.${domain_root}")"

	target_arch="$(gum choose --header "Target VPS architecture" "amd64" "arm64")"
	panel_password="$(ask_secret "Panel password:")"
	semaphore_password="$(ask_secret "Semaphore admin password:")"
	semaphore_email="$(ask_required "Semaphore admin email:" "admin@${domain_root}")"

	mkdir -p "$ANSIBLE_DIR/group_vars"

	{
		echo "[vault]"
		printf 'vault-vps ansible_host=%s ansible_user=%s ansible_port=%s' "$host" "$user" "$port"
		if [[ -n "$key" ]]; then
			printf ' ansible_ssh_private_key_file=%s' "$key"
		fi
		echo
	} > "$INVENTORY_FILE"

	cat > "$VARS_FILE" <<EOF
---
vault_app_root: /opt/vault
vault_app_user: vault
vault_service_name: vault-api
vault_api_port: 8080
vault_keep_releases: 5

vault_admin_domain: ${admin_domain}
vault_guest_domain: ${guest_domain}
vault_api_domain: ${api_domain}
vault_deploy_domain: ${deploy_domain}

vault_build_goos: linux
vault_build_goarch: ${target_arch}
vault_build_cgo_enabled: "1"

vault_panel_password: "${panel_password}"

semaphore_version: "2.17.26"
semaphore_port: 3000
semaphore_admin_user: admin
semaphore_admin_name: Admin
semaphore_admin_email: ${semaphore_email}
semaphore_admin_password: "${semaphore_password}"

semaphore_cookie_hash: "$(random_key)"
semaphore_cookie_encryption: "$(random_key)"
semaphore_access_key_encryption: "$(random_key)"
EOF

	chmod 0600 "$VARS_FILE"
	gum style --foreground 42 "Wrote $INVENTORY_FILE and $VARS_FILE"
}

ensure_config() {
	if ! config_exists; then
		gum style --foreground 214 "Ansible config files are missing."
		if gum confirm "Create them now?" --default=true; then
			setup_config
		else
			gum style --foreground 196 "Cannot continue without $INVENTORY_FILE and $VARS_FILE"
			exit 1
		fi
	fi
}

install_collections() {
	gum spin --spinner dot --title "Installing Ansible collections..." --show-output -- \
		ansible-galaxy collection install -r "$ANSIBLE_DIR/requirements.yml"
}

syntax_check() {
	local inventory="$INVENTORY_FILE"
	local vars="$VARS_FILE"
	if [[ ! -f "$inventory" || ! -f "$vars" ]]; then
		inventory="$EXAMPLE_INVENTORY"
		vars="$EXAMPLE_VARS"
	fi

	gum spin --spinner dot --title "Checking provision playbook syntax..." --show-output -- \
		ansible-playbook -i "$inventory" "$ANSIBLE_DIR/playbooks/provision.yml" -e "@$vars" --syntax-check
	gum spin --spinner dot --title "Checking deploy playbook syntax..." --show-output -- \
		ansible-playbook -i "$inventory" "$ANSIBLE_DIR/playbooks/deploy.yml" -e "@$vars" --syntax-check
}

run_provision() {
	ensure_config
	if confirm_or_yes "Provision VPS and install Caddy/Semaphore/systemd units?" false; then
		ansible-playbook -i "$INVENTORY_FILE" "$ANSIBLE_DIR/playbooks/provision.yml"
	fi
}

run_deploy() {
	ensure_config
	if confirm_or_yes "Build locally and deploy current release to VPS?" true; then
		ansible-playbook -i "$INVENTORY_FILE" "$ANSIBLE_DIR/playbooks/deploy.yml"
	fi
}

run_full() {
	ensure_config
	install_collections
	syntax_check
	run_provision
	run_deploy
}

run_status() {
	ensure_config
	local service
	service="$(gum choose --header "Service status" "vault-api" "semaphore" "caddy")"
	ansible -i "$INVENTORY_FILE" vault -b -m ansible.builtin.command -a "systemctl status ${service} --no-pager"
}

run_logs() {
	ensure_config
	local service lines
	service="$(gum choose --header "Service logs" "vault-api" "semaphore" "caddy")"
	lines="$(gum input --prompt "Lines: " --value "200" --char-limit 6)"
	ansible -i "$INVENTORY_FILE" vault -b -m ansible.builtin.command -a "journalctl -u ${service} -n ${lines} --no-pager"
}

show_install_help() {
	cat <<'EOF'
Local Debian/Ubuntu packages:

sudo apt update
sudo apt install -y ansible rsync build-essential golang-go nodejs npm

gum:

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg
echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list
sudo apt update && sudo apt install gum
EOF
}

main_menu() {
	while true; do
		local choice
		choice="$(gum choose --height 12 --header "Vault deploy" \
			"Configure local Ansible files" \
			"Install Ansible collections" \
			"Syntax check playbooks" \
			"Provision VPS" \
			"Deploy release" \
			"Provision then deploy" \
			"Service status" \
			"Service logs" \
			"Show local install commands" \
			"Quit")"

		case "$choice" in
			"Configure local Ansible files") setup_config ;;
			"Install Ansible collections") install_collections ;;
			"Syntax check playbooks") syntax_check ;;
			"Provision VPS") run_provision ;;
			"Deploy release") run_deploy ;;
			"Provision then deploy") run_full ;;
			"Service status") run_status ;;
			"Service logs") run_logs ;;
			"Show local install commands") show_install_help ;;
			"Quit") exit 0 ;;
		esac
	done
}

require_gum_first
ensure_local_tools

case "${1:-}" in
	configure) setup_config ;;
	collections) install_collections ;;
	check) syntax_check ;;
	provision) run_provision ;;
	deploy) run_deploy ;;
	"") main_menu ;;
	full) run_full ;;
	status) run_status ;;
	logs) run_logs ;;
	help|-h|--help)
		cat <<'EOF'
Usage: ./deploy.sh [command]

Commands:
  configure    Create ansible/inventory.ini and ansible/group_vars/vault.yml
  collections  Install Ansible Galaxy collections
  check        Run Ansible syntax checks
  provision    Provision VPS
  deploy       Build and deploy release
  full         Provision then deploy
  status       Show service status
  logs         Show service logs

No command opens the interactive TUI menu.
EOF
		;;
	*) gum style --foreground 196 "Unknown command: $1"; exit 1 ;;
esac
