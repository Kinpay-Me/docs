---
id: stripe
number: 1
title: Stripe
category: integrations
categoryTitle: Integrations
---

## Overview

KinPay uses Stripe for all integrated (on-platform) payments. Two Stripe products are in use:

- **Stripe Connect** — moves money between lenders and borrowers via connected accounts (see [[link:api-reference/api-payments|Payments API]])
- **PaymentIntents** — handles the payment flow on the payer side

## Environment variables

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for webhook verification (`whsec_...`) |
| `STRIPE_PLATFORM_FEE_PCT` | Platform fee percentage (e.g. `2.5`) |

## Connect onboarding

Borrowers who want to receive funds via Stripe must complete Stripe Express onboarding:

1. Call `GET /payments/stripe/connect/onboard` to generate an onboarding URL
2. Redirect the user to the URL — Stripe handles identity verification and bank account linking
3. Stripe fires an `account.updated` webhook when onboarding is complete
4. The backend sets `[[link:data-architecture/users-entity|users]].stripe_details_submitted = true`

## PaymentIntent metadata

All PaymentIntents must include the following metadata or the webhook will be ignored:

```json
{
  "contract_id": "<uuid>",
  "borrower_id": "<uuid>",
  "lender_id": "<uuid>",
  "type": "loan_disbursement | loan_repayment"
}
```

## Webhook endpoint

`POST /webhooks/stripe`

The Stripe Dashboard webhook configuration must point to this endpoint. The signing secret in `STRIPE_WEBHOOK_SECRET` must match the secret shown in the Stripe Dashboard → Webhooks → endpoint details.

**Verifying webhook delivery:** In Stripe Dashboard → Webhooks → Recent deliveries, all events should show `200` responses. A `400` means the signature check is failing — check that `STRIPE_WEBHOOK_SECRET` matches.

## Test cards

| Card number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

Use any future expiry date and any 3-digit CVC.
