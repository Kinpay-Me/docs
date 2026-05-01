---
id: payments-entity
number: 5
title: Payments
category: data-architecture
---

## Table: repayments

Records each repayment submission and its confirmation status.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `contract_id` | UUID | FK → contracts.id |
| `schedule_item_id` | UUID | FK → repayment_schedule_items.id (null for unscheduled) |
| `borrower_id` | UUID | FK → users.id |
| `amount_cents` | integer | Amount paid |
| `currency` | varchar(3) | |
| `method` | enum | `external`, `stripe` |
| `status` | enum | `submitted`, `confirmed`, `disputed` |
| `proof_url` | text | S3 URL of uploaded payment proof (external only) |
| `stripe_payment_intent_id` | varchar | Stripe PaymentIntent ID (integrated only) |
| `stripe_transfer_id` | varchar | Stripe Transfer ID (integrated only) |
| `submitted_at` | timestamptz | When borrower submitted |
| `confirmed_at` | timestamptz | When lender confirmed or Stripe auto-confirmed |
| `created_at` | timestamptz | |

## Table: platform_fees

Records the KinPay fee charged on each Stripe transaction.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `contract_id` | UUID | FK → contracts.id |
| `fee_type` | enum | `disbursement`, `repayment` |
| `amount_cents` | integer | Fee charged in minor units |
| `stripe_payment_intent_id` | varchar | Associated PaymentIntent |
| `stripe_checkout_session_id` | varchar | Stripe Checkout Session ID (if applicable) |
| `created_at` | timestamptz | |

## Payment method storage

KinPay does not store raw card or bank details. Payment methods are managed entirely through Stripe:

- **Borrowers** (receiving funds) must complete [[link:integrations/stripe|Stripe Connect]] onboarding to receive transfers to their bank account.
- **Lenders** (sending funds) pay through Stripe's Payment Element — cards are vaulted in Stripe, not in KinPay's database.
- The only Stripe identifier stored in KinPay is `stripe_customer_id` on the [[link:data-architecture/users-entity|user record]].

## Fee structure

KinPay charges a platform fee on all [[link:integrations/stripe|Stripe]]-integrated transactions. The fee is calculated as a percentage of the transaction amount and deducted at the Stripe level via the `application_fee_amount` parameter on PaymentIntents.
