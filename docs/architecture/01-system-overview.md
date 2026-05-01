---
id: system-overview
number: 1
title: System Overview
category: architecture
categoryTitle: Architecture
---

## High-level stack

KinPay is split into three independently deployable services: a Python backend API, a borrower/lender frontend, and an operator dashboard.

| Layer | Technology |
|---|---|
| Backend API | Python 3.12 + FastAPI + SQLAlchemy (async) |
| Primary database | PostgreSQL 15 (AWS RDS) |
| Background jobs | In-process async worker (APScheduler) |
| Frontend (app) | React 19 + React Router 7 + Tailwind CSS 4 |
| Frontend (dashboard) | React 19 + React Router 7 + Tailwind CSS 4 |
| File storage | AWS S3 |
| Payments | Stripe Connect (PaymentIntents + Transfer API) |
| Email | SendGrid (transactional templates) |
| Hosting | AWS ECS Fargate (backend) + static hosting (frontend) |
| CDN / TLS | AWS CloudFront + ACM |

For integration-specific configuration, see [[link:integrations/stripe|Stripe]], [[link:integrations/sendgrid|SendGrid]], and [[link:integrations/aws|AWS]].

## Request lifecycle

```
  Client (browser / mobile app)
         │
         │ HTTPS
         ▼
  ┌────────────────────────────────────────────────────┐
  │               React Frontend                        │
  │   app.kinpay.me  ·  dashboard.kinpay.me             │
  └─────────────────────┬──────────────────────────────┘
                        │ REST / JSON  (api.kinpay.me)
                        ▼
  ┌────────────────────────────────────────────────────┐
  │           AWS ALB  (TLS termination)                │
  └─────────────────────┬──────────────────────────────┘
                        │
                        ▼
  ┌────────────────────────────────────────────────────┐
  │         FastAPI Backend  (ECS Fargate)              │
  │                                                     │
  │  ┌──────┬───────┬───────────┬──────────┬────────┐  │
  │  │ auth │ loans │ contracts │ payments │ trust  │  │
  │  └──────┴───────┴───────────┴──────────┴────────┘  │
  └──────────────┬──────────────────────┬──────────────┘
                 │                      │
                 ▼                      ▼
  ┌──────────────────────┐  ┌─────────────────────────┐
  │    PostgreSQL 15      │  │     External APIs        │
  │     (AWS RDS)         │  │  Stripe · SendGrid · S3  │
  └──────────────────────┘  └─────────────────────────┘
```

All API responses follow a standard envelope:

```json
{
  "data": { ... },
  "message": "ok"
}
```

Errors return a non-2xx status with:

```json
{
  "detail": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

## Authentication

Authentication uses short-lived JWT access tokens (15 minutes) plus long-lived refresh tokens (30 days). Token rotation is enforced on every refresh.

OTP verification is required before accessing protected endpoints. Supported OTP channels: SMS (default), WhatsApp, email.

TOTP (authenticator app) is available as an optional second factor for users who enable it. See the [[link:api-reference/api-auth|Auth API]] for all authentication endpoints.

## Source repositories

| Repo | Contents |
|---|---|
| `kinpay-backend` | FastAPI backend + database migrations |
| `kinpay` (monorepo) | Borrower/lender app (`/app`) + operator dashboard (`/dashboard`) + E2E tests (`/e2e`) |
| `docs-viewer` | Reusable docs viewer component (this page) |
