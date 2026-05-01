---
id: environment
number: 2
title: Environment Variables
category: deployment
---

## Backend environment variables

### Database

| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@host/kinpay` | Primary database connection |

### JWT / Auth

| Variable | Example | Description |
|---|---|---|
| `SECRET_KEY` | `(random 64-char hex)` | JWT signing key — rotate if leaked |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `30` | Refresh token lifetime |

### Stripe

See [[link:integrations/stripe|Stripe integration]] for full setup and webhook configuration details.

| Variable | Example | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signing secret — must match Stripe Dashboard |
| `STRIPE_PLATFORM_FEE_PCT` | `2.5` | KinPay fee as a percentage |

### SendGrid

See [[link:integrations/sendgrid|SendGrid integration]] for sender verification requirements.

| Variable | Example | Description |
|---|---|---|
| `SENDGRID_API_KEY` | `SG.xxx` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | `hello@kinpay.me` | Verified sender address |
| `SENDGRID_FROM_NAME` | `KinPay` | Sender display name |

### AWS

See [[link:integrations/aws|AWS integration]] for service configuration details.

| Variable | Example | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | IAM key for S3 |
| `AWS_SECRET_ACCESS_KEY` | `(secret)` | |
| `AWS_REGION` | `eu-west-1` | |
| `S3_BUCKET_NAME` | `kinpay-uploads` | S3 bucket for all file uploads |

### App URLs

| Variable | Example | Description |
|---|---|---|
| `FRONTEND_URL` | `https://app.kinpay.me` | Used in email links and CORS |
| `BACKEND_URL` | `https://api.kinpay.me` | Used in Stripe webhook registration |

### Feature flags

| Variable | Default | Description |
|---|---|---|
| `DISABLE_NOTIFICATIONS` | `false` | Suppress all outgoing emails (used in E2E tests) |
| `ENVIRONMENT` | `production` | `production` disables `/dev/*` endpoints |

## Frontend environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for PaymentElement |

## Dashboard environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `SESSION_SECRET` | Secret for encrypting session cookies |

## Secrets management

In production, all sensitive variables are stored in AWS Secrets Manager and injected into ECS task definitions as environment variables. They are never committed to the repository or stored in `.env` files on production servers.
