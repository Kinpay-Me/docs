---
id: loans-entity
number: 2
title: Loan Requests
category: data-architecture
---

## Table: loan_requests

Represents a borrower's loan request before it becomes a contract. One row per request.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `short_id` | varchar(10) | Short public identifier used in share links (e.g. `abc123`) |
| `borrower_id` | UUID | FK → users.id |
| `lender_id` | UUID | FK → users.id (null until a lender accepts) |
| `invited_email` | varchar(255) | Email of an invited lender who is not yet registered (null if lender is a registered user) |
| `amount_cents` | integer | Loan principal in minor currency units |
| `currency` | varchar(3) | ISO-4217 (e.g. `NGN`, `GHS`, `KES`) |
| `duration_months` | integer | Total loan duration |
| `repayment_structure` | enum | `lump_sum`, `installments` |
| `repayment_frequency` | enum | `monthly`, `weekly`, `biweekly` (null for lump-sum) |
| `interest_rate_pct` | numeric(5,2) | Annual interest rate as a percentage |
| `purpose` | text | Optional description of what the loan is for |
| `first_repayment_date` | date | Optional override for the first repayment due date |
| `share_link_token` | varchar | Unique token for the public share link |
| `status` | enum | See [[link:architecture/loan-lifecycle|loan request states]] |
| `borrower_country_code` | varchar(2) | Borrower's country at time of request |
| `lender_country_code` | varchar(2) | Lender's country at time of acceptance (null until set) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

## Invite flow

When a borrower shares a request with an email address that is not yet registered:

1. `invited_email` is set on the loan request.
2. The share link (`/l/{short_id}`) displays an invite-specific UI for unauthenticated visitors.
3. The "Create Account to Accept" link pre-fills the register form with the invited email (read-only).
4. Once the invited user registers and visits the link, they see the accept flow.
5. A registered user with a different email visiting the same link sees a "reserved for a specific lender" message.

See [[link:data-architecture/participants|Participants & Roles]] for visibility rules on invited lenders.

## Countered terms

When a lender proposes changes, a `loan_request_counters` record is created (see [[link:data-architecture/contracts-entity|Contracts]]). The original `loan_requests` row stays unchanged.
