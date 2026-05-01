---
id: trust-system
number: 8
title: Trust System
category: data-architecture
---

## Overview

Every user has a trust score that reflects their repayment and lending history on KinPay. The score starts at 500 (Silver tier) and moves up or down based on events. It is designed to give both sides of a loan a quick signal of the other party's track record.

## Trust tiers

| Tier | Score range | Description |
|---|---|---|
| `BRONZE` | 0 – 399 | New user or poor repayment history |
| `SILVER` | 400 – 599 | Default starting tier |
| `GOLD` | 600 – 799 | Consistent on-time repayments |
| `PLATINUM` | 800 – 1000 | Excellent long-term track record |

## Table: trust_scores

One row per user. Updated in place each time the score changes.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users.id (unique) |
| `score` | smallint | Current score (0–1000) |
| `tier` | enum | `BRONZE`, `SILVER`, `GOLD`, `PLATINUM` |
| `on_time_repayments` | integer | Lifetime count |
| `late_repayments` | integer | Lifetime count |
| `missed_repayments` | integer | Lifetime count |
| `contracts_completed` | integer | Lifetime count |
| `contracts_active` | integer | Currently active |
| `contracts_defaulted` | integer | Lifetime count |
| `total_borrowed_cents` | integer | Total principal borrowed across all contracts |
| `total_lent_cents` | integer | Total principal lent across all contracts |
| `last_computed_at` | timestamptz | When the score was last recalculated |
| `updated_at` | timestamptz | |

## Table: trust_events

An append-only log of every individual score change. One row per event.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users.id |
| `event_type` | varchar(60) | e.g. `repayment_on_time`, `contract_completed`, `repayment_late` |
| `contract_id` | UUID | FK → contracts.id (nullable) |
| `score_delta` | smallint | Positive or negative change |
| `score_after` | smallint | Score after applying this delta |
| `metadata` | JSONB | Event-specific context |
| `created_at` | timestamptz | |

Trust events are triggered by changes in [[link:data-architecture/contracts-entity|contract]] and [[link:data-architecture/payments-entity|repayment]] status.

## Score events

| Event type | Delta | Triggered by |
|---|---|---|
| `repayment_on_time` | +20 | Repayment confirmed on or before due date |
| `repayment_late` | −15 | Repayment confirmed after due date |
| `repayment_missed` | −30 | Repayment overdue by a significant margin |
| `contract_completed` | +50 | All repayments on a contract confirmed |
| `contract_defaulted` | −100 | Contract marked as defaulted |
| `first_loan_as_borrower` | +25 | First time completing a borrowing contract |
| `first_loan_as_lender` | +25 | First time completing a lending contract |

## Notes

- Trust scores are computed server-side only. The score displayed in the app is always read from `trust_scores.score`.
- The `trust_events` table provides a full audit trail of why a score changed — this is important for dispute resolution.
- Tier thresholds are constants in `app/loans/constants.py` as `TrustTier`.
