---
id: audit-log
number: 7
title: Activity & Audit Logs
category: data-architecture
---

## Table: loan_audit_logs

An append-only event log for all significant state changes on loan requests and contracts. Every row is immutable once written — nothing is ever updated or deleted.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `contract_id` | UUID | FK → contracts.id (nullable for pre-contract events) |
| `loan_request_id` | UUID | FK → loan_requests.id |
| `event` | varchar | Machine-readable event name (see events below) |
| `actor_id` | UUID | FK → users.id — who triggered the event |
| `actor_role` | varchar | `borrower`, `lender`, `system`, `admin` |
| `context` | JSONB | Event-specific metadata (amounts, statuses, etc.) |
| `created_at` | timestamptz | Exact time of event — server-set, never client-supplied |

For a description of when each event fires, see the [[link:architecture/loan-lifecycle|Loan Lifecycle]].

## Loan audit events

| Event | Description |
|---|---|
| `loan.created` | Loan request created by borrower |
| `loan.shared` | Request shared via link, username, or email |
| `loan.countered` | Lender proposed modified terms |
| `loan.accepted` | Lender accepted the request |
| `loan.cancelled` | Borrower cancelled the request |
| `loan.funded` | Lender marked the loan as funded (external) |
| `contract.signed` | A party signed the contract |
| `contract.fully_signed` | Both parties have signed |
| `contract.active` | Contract became active (funded) |
| `repayment.submitted` | Borrower submitted a repayment |
| `repayment.confirmed` | Lender confirmed a repayment |
| `repayment.disputed` | Lender raised a dispute |
| `repayment.dispute_resolved` | Admin resolved a dispute |
| `contract.completed` | All repayments confirmed |
| `contract.defaulted` | Contract marked as defaulted |

## Table: auth_audit_logs

A separate append-only log for authentication events. Stored in `auth_audit_logs`.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users.id (nullable for failed login attempts) |
| `event_type` | varchar | e.g. `user.login_success`, `user.otp_verified`, `user.password_reset` |
| `outcome` | enum | `success`, `failure` |
| `ip_address` | varchar | Client IP |
| `user_agent` | text | Client user-agent string |
| `country_code` | varchar(2) | Geo-resolved from IP |
| `context` | JSONB | Additional context (channel used, failure reason, etc.) |
| `created_at` | timestamptz | |

## Immutability guarantee

Both log tables are append-only by design. No `UPDATE` or `DELETE` is ever issued against them. The application enforces this at the service layer — there are no update methods for audit log rows.

For the auth audit log, operators can read via [[link:api-reference/api-admin|`GET /admin/auth/logs`]] but cannot modify entries.

## Exportability

Both logs are filterable by date range, event type, outcome, and country code via the admin API. They can be paginated in pages of up to 200 rows and are suitable for export to a CSV or external logging system.
