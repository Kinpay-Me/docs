---
id: contracts-entity
number: 4
title: Contracts
category: data-architecture
---

## Table: contracts

The legally binding record created once a loan request is accepted and signed by both parties.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `loan_request_id` | UUID | FK → loan_requests.id |
| `borrower_id` | UUID | FK → users.id |
| `lender_id` | UUID | FK → users.id |
| `amount_cents` | integer | Principal in minor units |
| `currency` | varchar(3) | ISO-4217 |
| `duration_months` | integer | |
| `repayment_structure` | enum | `lump_sum` or `installments` |
| `repayment_frequency` | enum | `monthly`, `weekly`, `biweekly` |
| `interest_rate_pct` | numeric(5,2) | Annual interest rate |
| `purpose` | text | Copied from loan request |
| `first_repayment_date` | date | First repayment due date |
| `status` | enum | See [[link:architecture/loan-lifecycle|contract states]] |
| `funding_method` | enum | `external`, `stripe` (null until funded) |
| `funded_at` | timestamptz | When the lender confirmed funding |
| `funding_transfer_id` | varchar | Stripe transfer ID (integrated path only) |
| `borrower_signed_at` | timestamptz | When borrower signed |
| `lender_signed_at` | timestamptz | When lender signed |
| `borrower_signature_url` | text | S3 URL of borrower signature at signing time |
| `lender_signature_url` | text | S3 URL of lender signature at signing time |
| `borrower_country_code` | varchar(2) | Borrower's country |
| `lender_country_code` | varchar(2) | Lender's country |
| `pdf_url` | text | S3 URL of the generated contract PDF |
| `completed_at` | timestamptz | When all repayments were confirmed |
| `defaulted_at` | timestamptz | When contract was marked defaulted |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

## Table: repayment_schedule_items

One row per scheduled repayment, generated when the contract becomes active.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `contract_id` | UUID | FK → contracts.id |
| `installment_number` | integer | 1-based index |
| `due_date` | date | When this repayment is due |
| `amount_cents` | integer | Total amount due (principal + interest) |
| `principal_cents` | integer | Principal portion |
| `interest_cents` | integer | Interest portion |
| `status` | enum | `pending`, `submitted`, `confirmed`, `late`, `disputed` |
| `paid_at` | timestamptz | When confirmed |
| `created_at` | timestamptz | |

## Notes

- Signatures are captured as image files at the time of signing. The `*_signature_url` columns store the [[link:integrations/aws|S3]] URLs and are embedded in the PDF.
- `funding_method` is set when `fund_external` or `on_disbursement_succeeded` (Stripe webhook) is called.
- `funding_transfer_id` is only populated for [[link:integrations/stripe|Stripe]]-funded contracts and is used for reconciliation.
