---
id: api-payments
number: 4
title: Payments & Webhooks
category: api-reference
---

## Stripe PaymentIntent flow

All integrated payments use [[link:integrations/stripe|Stripe]] PaymentIntents.

1. The client calls the relevant endpoint (`/fund/integrated` or `/repay/integrated`)
2. The backend creates a PaymentIntent with the contract and user metadata
3. The client receives a `client_secret` and mounts Stripe's PaymentElement
4. The user completes payment in the browser
5. Stripe fires a webhook to `/webhooks/stripe`
6. The backend verifies the webhook signature and processes the event

## POST /webhooks/stripe

Receives Stripe webhook events. All requests must include a valid `Stripe-Signature` header.

Handled events:

| Event | Handler |
|---|---|
| `payment_intent.succeeded` | Marks contract active (disbursement) or repayment confirmed |
| `account.updated` | Updates `stripe_details_submitted` on the [[link:data-architecture/users-entity|user record]] |

## PaymentIntent metadata

Every PaymentIntent created by KinPay includes these metadata fields:

| Key | Value |
|---|---|
| `contract_id` | UUID of the contract |
| `borrower_id` | UUID of the borrower |
| `lender_id` | UUID of the lender |
| `type` | `loan_disbursement` or `loan_repayment` |

If any of these are missing from a webhook payload, the event is silently ignored.

## Stripe Connect

KinPay uses [[link:integrations/stripe|Stripe Connect]] to move money between lenders and borrowers.

- **Lenders** connect their bank account via Stripe Connect (Express onboarding). The `stripe_details_submitted` flag is set to `true` when they complete onboarding.
- **Disbursements** use `destination charges` — the lender pays, Stripe transfers to the borrower's connected account, KinPay takes an application fee.
- **Repayments** use `separate transfers` — the borrower pays, Stripe transfers to the lender's connected account.

## GET /payments/stripe/connect/onboard

Generate a Stripe Connect onboarding URL for the authenticated user.

**Response** — `{ url }` — redirect the user to this URL to complete Stripe Express onboarding.

## GET /payments/stripe/connect/status

Check whether the authenticated user has completed Stripe Connect onboarding.

**Response** — `{ details_submitted: bool, charges_enabled: bool }`
