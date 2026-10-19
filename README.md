# Tree of Love

Next.js site with Payload CMS. Staff sign in at `/admin`.

## Local setup

1. Copy `.env.example` to `.env` and set `PAYLOAD_SECRET` to a long random string.
2. Start Postgres: `docker compose up -d`
3. Install and run: `npm install` then `npm run dev`
4. Open `http://localhost:3000` and create the first staff user at `http://localhost:3000/admin`
5. Load sample pages, programs, and children: `npm run seed`

`DATABASE_URL` in `.env.example` matches the local Docker database.

## Donations and contact email

Stripe Checkout takes one-time and monthly gifts in euros (card and SEPA). Set `STRIPE_SECRET_KEY` to the test secret key. Point Stripe webhooks at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`. Events used: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `invoice.paid`.

Local forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Contact messages are saved in the admin. Set `RESEND_API_KEY` and `RESEND_FROM` to email them to the notification address in site settings. Until those are set, the message is still saved.
