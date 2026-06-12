# Разработка

Краткий список инструментов, нужных на машине разработчика для локальной разработки, сборки и деплоя на VPS.

## Системные пакеты

Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y \
  ansible \
  build-essential \
  curl \
  gcc-x86-64-linux-gnu \
  git \
  golang-go \
  libc6-dev-amd64-cross \
  make \
  nodejs \
  npm \
  openssh-client \
  rsync
```

`build-essential` нужен backend-сборке, потому что проект использует SQLite через CGO.
`gcc-x86-64-linux-gnu` и `libc6-dev-amd64-cross` нужны, когда машина разработчика не `amd64`, а VPS целевой сборки `amd64`.
`openssh-client` нужен для SSH-доступа и `rsync`-загрузки релизов через Ansible.

Если первый доступ к VPS выполняется по паролю и нужно добавить SSH-ключ с машины разработчика, также понадобится:

```bash
sudo apt install -y sshpass
```

## Интерактивный TUI на Gum

`scripts/deploy.sh` использует `gum` для интерактивного TUI.

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg
echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list
sudo apt update
sudo apt install -y gum
```

## Зависимости проекта

Бэкенд:

```bash
cd backend
go mod download
```

Админский фронтенд:

```bash
cd frontend/admin
npm install
```

Гостевой фронтенд:

```bash
cd frontend/guest
npm install
```

Коллекции Ansible:

```bash
ansible-galaxy collection install -r ansible/requirements.yml
```

## Локальная разработка

API бэкенда:

```bash
cd backend
make dev
```

Админский фронтенд:

```bash
cd frontend/admin
npm run dev
```

Гостевой фронтенд:

```bash
cd frontend/guest
npm run dev
```

Локальные порты по умолчанию:

- API бэкенда: `8080`
- админский фронтенд: `3001`
- гостевой фронтенд: `3002`

## Проверки

Бэкенд:

```bash
cd backend
make check
```

Админский фронтенд:

```bash
cd frontend/admin
npm run lint
npm run build
```

Гостевой фронтенд:

```bash
cd frontend/guest
npm run build
```

Проверка синтаксиса Ansible playbook для деплоя:

```bash
make check
```

## Настройка деплоя

Создать локальные конфиги деплоя, которые игнорируются git:

```bash
cp ansible/inventory.example.ini ansible/inventory.ini
cp ansible/group_vars/vault.example.yml ansible/group_vars/vault.yml
```

Затем отредактировать:

- `ansible/inventory.ini`
- `ansible/group_vars/vault.yml`

Эти файлы содержат значения для конкретного сервера и секреты, их нельзя коммитить.

## Деплой

Подробный рабочий процесс деплоя описан в [`DEPLOY.md`](DEPLOY.md).

Интерактивный TUI для деплоя:

```bash
make deploy
```

Прямые команды:

```bash
make collections
make provision
make release
make status
make logs
```

Процесс деплоя собирает артефакты локально, загружает их на VPS через `rsync` внутри Ansible, переключает symlink `current`, перезапускает `vault-api` и проверяет `/ready`.
API на сервере должен быть доступен только через Caddy: сам процесс слушает `127.0.0.1:8080`, наружу открыты только `80/443`.
