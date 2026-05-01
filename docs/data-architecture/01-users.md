---
id: users-entity
number: 1
title: Users
category: data-architecture
categoryTitle: Data Architecture
---

## Table: users

The central identity record. One row per registered user.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `full_name` | varchar(100) | Display name |
| `email` | varchar(255) | Unique, verified via OTP |
| `phone` | varchar(20) | Optional, used for SMS OTP |
| `username` | varchar(50) | Unique handle (e.g. `@kofi`) |
| `hashed_password` | text | bcrypt hash |
| `role` | enum | `user`, `operator`, `super_admin` |
| `is_verified` | bool | True after first OTP verification |
| `is_active` | bool | False when suspended |
| `country_code` | varchar(2) | ISO-3166 alpha-2 (e.g. `NG`) |
| `avatar_url` | text | S3 URL of profile photo |
| `signature_url` | text | S3 URL of drawn/uploaded signature image |
| `stripe_customer_id` | varchar | Stripe Customer ID for payment methods |
| `stripe_details_submitted` | bool | True when [[link:integrations/stripe|Stripe Connect]] onboarding is complete |
| `totp_secret` | text | TOTP secret (nullable — only set if 2FA enabled) |
| `totp_enabled` | bool | Whether TOTP 2FA is active |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

## Legal identity fields

These fields are collected as part of identity verification. All are nullable until the user completes the identity step.

| Column | Type | Description |
|---|---|---|
| `id_type` | varchar | e.g. `national_id`, `passport`, `drivers_license` |
| `id_number` | varchar | Document number |
| `id_country` | varchar(2) | Issuing country (ISO-3166 alpha-2) |
| `date_of_birth` | date | |
| `id_verified` | bool | True if identity has been verified |
| `id_verified_at` | timestamptz | When verification was completed |

## Indexes

- `UNIQUE (email)`
- `UNIQUE (username)` (non-null only)
- `UNIQUE (phone)` (non-null only)
- `UNIQUE (stripe_customer_id)` (non-null only)

## Notes

- `role` is stored as a PostgreSQL enum. Role escalation to `operator` or `super_admin` is done by an existing `super_admin` via [[link:api-reference/api-admin|`POST /admin/users/{id}/roles`]].
- `signature_url` is set when the user draws or uploads their signature during contract signing. It is embedded in the PDF version of the contract.
- `totp_secret` is only populated if the user has enrolled in TOTP 2FA. It is never exposed in API responses.
