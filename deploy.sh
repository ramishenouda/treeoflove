#!/usr/bin/env bash
# Build and start the production stack. Run from the project folder after `git pull`.
set -euo pipefail

cd "$(dirname "$0")"

COMPOSE=(docker compose -f docker-compose.prod.yml)

fail() {
  echo "Deploy stopped: $1" >&2
  exit 1
}

[ -f .env ] || fail "create .env first (cp .env.example .env) and fill it in."
docker compose version >/dev/null 2>&1 || fail "Docker with the compose plugin is required."

set -a
# shellcheck disable=SC1091
. ./.env
set +a

for name in SITE_URL PAYLOAD_SECRET POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB; do
  value="${!name:-}"
  [ -n "$value" ] || fail "$name is empty in .env."
  case "$value" in
    replace-with-*) fail "$name still has the example value in .env." ;;
  esac
done

[[ "$POSTGRES_PASSWORD" =~ ^[A-Za-z0-9_-]+$ ]] ||
  fail "POSTGRES_PASSWORD can only use letters, digits, - and _ (it goes into a connection URL)."

echo "Building and starting containers…"
"${COMPOSE[@]}" up -d --build --remove-orphans

port="${APP_PORT:-3000}"
echo "Waiting for the site on port $port (database migrations run on startup)…"
for _ in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then
    docker image prune -f >/dev/null
    echo "Deployed. The site answers at http://127.0.0.1:${port} and should be public at ${SITE_URL}."
    exit 0
  fi
  sleep 3
done

echo "The site did not answer in time. Recent app logs:" >&2
"${COMPOSE[@]}" logs --tail=80 app >&2
exit 1
