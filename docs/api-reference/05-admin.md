---
id: api-admin
number: 5
title: Admin API
category: api-reference
---

All admin endpoints require the `operator` or `super_admin` role. Role-modifying endpoints (`/roles`, `/suspend`, `/reactivate`) require `super_admin`.

## Dashboard stats

| Endpoint | Description |
|---|---|
| `GET /admin/stats/users` | Total users + trend |
| `GET /admin/stats/contracts` | Total contracts + trend |
| `GET /admin/stats/loan-requests` | Total loan requests + trend |
| `GET /admin/stats/volume` | Total transaction volume + trend |
| `GET /admin/stats/repayment-rate` | On-time repayment rate |
| `GET /admin/stats/fees` | Platform fee revenue + breakdown |

All stat endpoints accept `start_date`, `end_date`, and `country_code` query params.

## User management

### GET /admin/users

Paginated list of all users.

**Query params** — `page`, `page_size`, `search` (name/email), `role`, `country_code`, `is_active`

### GET /admin/users/{id}

Full [[link:data-architecture/users-entity|user]] detail including [[link:data-architecture/trust-system|trust score]], active contracts, and recent auth events.

### POST /admin/users/{id}/suspend

Suspend a user account. Sets `is_active = false`. Requires `super_admin`.

### POST /admin/users/{id}/reactivate

Reactivate a suspended account. Requires `super_admin`.

### POST /admin/users/{id}/roles

Assign roles to a user. Requires `super_admin`.

**Request body** — `roles: string[]` (e.g. `["operator"]`)

## Contract management

### GET /admin/contracts

Paginated list of all contracts.

**Query params** — `page`, `page_size`, `status`, `country_code`, `start_date`, `end_date`

### GET /admin/contracts/{id}

Full contract detail.

### POST /admin/contracts/{id}/mark-defaulted

Mark a contract as defaulted. Updates status and records a `contract.defaulted` audit event.

## Loan management

### GET /admin/loans

Paginated list of all loan requests.

### GET /admin/loans/audit

Paginated loan audit log across all contracts.

**Query params** — `page`, `page_size`, `event`, `actor_role`, `start_date`, `end_date`

## Repayment disputes

### GET /admin/repayments/disputed

List all repayments currently in `disputed` state across all contracts.

### POST /admin/repayments/{id}/resolve-dispute

Resolve a dispute. Records a `repayment.dispute_resolved` event.

**Request body** — `resolution` (`confirm` or `reject`), `note` (optional)

## Auth audit log

### GET /admin/auth/logs

Paginated [[link:data-architecture/audit-log|auth audit log]].

**Query params** — `page`, `page_size`, `event_type`, `outcome`, `country_code`, `start_date`, `end_date`

### GET /admin/auth/logs/summary

Dashboard summary of auth events — registration counts, login success/failure rates, OTP channel usage, top corridors.

## Platform fees

### GET /admin/fees

List all platform fee records with contract and user context.
