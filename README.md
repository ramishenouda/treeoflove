# Tree of Love

Next.js site with Payload CMS. Staff sign in at `/admin`.

## Local setup

1. Copy `.env.example` to `.env` and set `PAYLOAD_SECRET` to a long random string.
2. Start Postgres (and Adminer): `docker compose up -d`
3. Install and run: `npm install` then `npm run dev`
4. Open `http://localhost:3000` and create the first staff user at `http://localhost:3000/admin`
5. Load sample pages, programs, and children: `npm run seed`

`DATABASE_URL` in `.env.example` matches the local Docker database.

Browse tables in the browser at `http://localhost:8080` (Adminer — like phpMyAdmin for Postgres). System: **PostgreSQL**, Server: **postgres**, Username/Password: **postgres**, Database: **treeoflove**.

## Donations and contact email

Stripe Checkout takes one-time and monthly gifts in euros (card and SEPA). Set `STRIPE_SECRET_KEY` to the test secret key. Point Stripe webhooks at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`. Events used: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `invoice.paid`.

Local forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Contact messages are saved in the admin. Set `RESEND_API_KEY` and `RESEND_FROM` to email them to the notification address in site settings. Until those are set, the message is still saved.

## Deploying to a server

The server needs Git and Docker with the compose plugin.

First time:

```bash
git clone <repo-url> treeoflove && cd treeoflove
cp .env.example .env
nano .env        # set SITE_URL (https://your-domain), PAYLOAD_SECRET, POSTGRES_PASSWORD, Stripe and Resend keys
./deploy.sh
```

Each update:

```bash
git pull && ./deploy.sh
```

`deploy.sh` checks `.env`, builds the image, starts Postgres and the site with `docker-compose.prod.yml`, and waits until `/api/health` answers. Database migrations in `src/migrations` run automatically when the site starts. Uploaded images and the database live in Docker volumes, so they survive redeploys.

The site listens on `127.0.0.1:${APP_PORT}`. nginx in front of it handles HTTPS, redirects `treeoflove.life` to `www.treeoflove.life`, adds security headers, and rate-limits logins and form posts. The config is in `nginx/treeoflove.life.conf`; its upstream port must match `APP_PORT`. Once DNS for both names points at the server:

```bash
certbot certonly --webroot -w /var/www/certbot \
  -d www.treeoflove.life -d treeoflove.life \
  --deploy-hook "systemctl reload nginx"
cp nginx/treeoflove.life.conf /etc/nginx/sites-available/treeoflove.life
nginx -t && systemctl reload nginx
```

nginx blocks Payload's "create first user" page and endpoint from the internet, so create the first staff user from the server:

```bash
read -rp 'Email: ' EMAIL; read -rsp 'Password: ' PASSWORD; echo
jq -n --arg email "$EMAIL" --arg password "$PASSWORD" '{email: $email, password: $password}' |
  curl -fsS -X POST http://127.0.0.1:3020/api/users/first-register \
    -H 'Content-Type: application/json' --data-binary @- >/dev/null && echo created
```

In Stripe, add a live webhook to `https://www.treeoflove.life/api/stripe/webhook`.

Do not run the development `docker-compose.yml` on the server: it publishes Postgres and Adminer on every network interface with default passwords.

Database browser on the server: `docker compose -f docker-compose.prod.yml --profile tools up -d adminer`, then `ssh -L 8080:127.0.0.1:8080 you@server` and open `http://localhost:8080` (Server: **postgres**, credentials from `.env`).

### Changing the content schema

Local development updates the database directly. Before deploying a change to collections or fields, create a migration and commit it:

```bash
npm run payload migrate:create describe-the-change
```
