# Деплой

Документ описывает рабочий процесс деплоя на VPS через Ansible. GitHub/GitLab и Docker registry в этой схеме не используются: сборка выполняется на машине разработчика, артефакты отправляются на сервер напрямую через SSH/rsync.

## Обычный деплой новой версии

Из корня проекта:

```bash
make release
```

Эта команда:

- собирает Go backend локально;
- устанавливает зависимости и собирает admin frontend;
- устанавливает зависимости и собирает guest frontend;
- загружает собранный release на VPS через `rsync`;
- переключает `/opt/vault/current` на новый release;
- перезапускает `vault-api`;
- проверяет готовность API через `/ready`.

Это основная команда, которую нужно запускать после изменений в коде.

## Перед деплоем

Для backend-изменений желательно выполнить:

```bash
cd backend
make check
```

Для проверки Ansible playbook:

```bash
make check
```

Для frontend-изменений можно дополнительно проверить сборку конкретного приложения:

```bash
cd frontend/admin
npm run build
```

```bash
cd frontend/guest
npm run build
```

## Первый деплой или изменение инфраструктуры

Provisioning нужен при первом запуске на новом VPS или после изменений в серверной конфигурации: Caddy, systemd, UFW, Semaphore, env-файлы, домены, сервисные пользователи.

```bash
make provision
```

После provisioning обычно запускается release:

```bash
make release
```

Первичная настройка для текущего VPS уже выполнена. Повторять `make provision` для каждого изменения кода не нужно.

## Интерактивное меню

Для интерактивного TUI:

```bash
make deploy
```

Меню позволяет:

- создать локальные Ansible-конфиги;
- установить Ansible collections;
- проверить syntax playbook;
- выполнить provisioning;
- выполнить release;
- посмотреть status и logs сервисов.

## Локальные конфиги

Боевые настройки лежат в ignored-файлах:

```text
ansible/inventory.ini
ansible/group_vars/vault.yml
```

В них находятся адрес VPS, SSH-параметры, домены и секреты. Эти файлы нельзя коммитить.

Примеры для новой машины:

```text
ansible/inventory.example.ini
ansible/group_vars/vault.example.yml
```

## Проверка после деплоя

Публичные проверки:

```bash
curl -fsS https://api.guestbank.net/ready
curl -fsSI https://admin.guestbank.net/
curl -fsSI https://guest.guestbank.net/
curl -fsSI https://deploy.guestbank.net/
```

Ожидаемо:

- API `/ready` возвращает `{"database":"ok","status":"ok"}`;
- admin, guest и deploy возвращают HTTP `200`;
- наружу доступны только `22/tcp`, `80/tcp`, `443/tcp`;
- `vault-api` слушает `127.0.0.1:8080`;
- Semaphore слушает `127.0.0.1:3000`.

## Статус и логи

Через Makefile:

```bash
make status
make logs
```

Напрямую на сервере:

```bash
systemctl status vault-api --no-pager
systemctl status caddy --no-pager
systemctl status semaphore --no-pager
```

```bash
journalctl -u vault-api -n 200 --no-pager
journalctl -u caddy -n 200 --no-pager
journalctl -u semaphore -n 200 --no-pager
```

## Где лежит release на сервере

```text
/opt/vault/
  current -> /opt/vault/releases/<release-id>
  releases/
  shared/
    data/vault.db
    env/vault-api.env
```

Каждый `make release` создает новый каталог в `/opt/vault/releases/` и переключает symlink `current`.

## Типовой цикл

```bash
cd /home/superuser/dev/vault

# опционально, если менялся backend
cd backend && make check && cd ..

# опционально, если менялись playbook/templates
make check

# деплой текущей версии
make release
```
