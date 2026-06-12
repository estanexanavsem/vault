# Требования к серверу

Краткий список требований к серверу, чтобы Ansible-деплой работал.

## Операционная система

Ожидается Debian/Ubuntu сервер с `systemd` и `apt`.

Проверить:

```bash
systemctl --version
apt --version
```

## Сеть

DNS-записи A/AAAA должны указывать на сервер:

- `admin.example.com`
- `guest.example.com`
- `api.example.com`

Открытые входящие порты:

- `22/tcp` для SSH
- `80/tcp` для HTTP-проверки и перенаправления
- `443/tcp` для HTTPS

Если включен файрвол, пример для UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## SSH-доступ

С машины разработчика должен работать SSH-доступ к серверу:

```bash
ssh root@203.0.113.10
```

Можно использовать не-root пользователя, но он должен иметь `sudo` без интерактивных препятствий для задач подготовки и деплоя.

## Пакеты, которые устанавливает Ansible

`ansible/playbooks/provision.yml` устанавливает на VPS:

- `ansible`
- `apt-transport-https`
- `build-essential`
- `ca-certificates`
- `curl`
- `debian-archive-keyring`
- `debian-keyring`
- `git`
- `gnupg`
- `python3`
- `python3-pip`
- `rsync`
- `sqlite3`
- `sudo`
- `ufw`
- `caddy`

Обычно вручную ставить эти пакеты на сервер не нужно, достаточно запустить:

```bash
make provision
```

## Сервисы под управлением Ansible

Ansible создает и включает:

- `vault-api.service`
- `caddy.service`

Проверка:

```bash
systemctl status vault-api --no-pager
systemctl status caddy --no-pager
```

## Структура сервера

Ansible использует такую структуру:

```text
/opt/vault/
  current -> /opt/vault/releases/<release-id>
  releases/
  shared/
    data/vault.db
    env/vault-api.env

/etc/caddy/Caddyfile
```

## HTTPS

HTTPS настраивает Caddy автоматически.

Для успешного выпуска сертификатов нужны:

- корректные DNS-записи
- доступные извне `80/tcp` и `443/tcp`
- запущенный `caddy.service`

Логи Caddy:

```bash
journalctl -u caddy -n 200 --no-pager
```

## Runtime-порты

Внутренние localhost-порты:

- Go API: `127.0.0.1:8080`

Этот порт не должен быть открыт наружу. Ansible настраивает UFW с входящим default deny и разрешает только `22/tcp`, `80/tcp` и `443/tcp`. Наружу смотрит только Caddy на `80/443`.

## Резервные копии SQLite

Перед рискованными изменениями можно сделать резервную копию базы:

```bash
sudo -u vault sqlite3 /opt/vault/shared/data/vault.db ".backup /opt/vault/shared/data/vault-$(date -u +%Y%m%d%H%M%S).db"
```

## Диагностика

Готовность API:

```bash
curl -fsS http://127.0.0.1:8080/ready
```

Логи сервисов:

```bash
journalctl -u vault-api -n 200 --no-pager
journalctl -u caddy -n 200 --no-pager
```
