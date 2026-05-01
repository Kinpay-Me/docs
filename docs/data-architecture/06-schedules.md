---
id: repayment-schedules
number: 6
title: Repayment Schedules
category: data-architecture
---

## Schedule generation

When a [[link:data-architecture/contracts-entity|contract]] transitions to `ACTIVE` (funded), the system calls `generate_schedule`. This creates one `repayment_schedule_item` row per instalment based on the contract's terms.

For **lump-sum** contracts, one item is created with the full principal plus total interest.

For **instalment** contracts, the schedule is an amortised sequence of equal payments. Each item records:
- The total amount due
- The principal portion for that payment
- The interest portion for that payment
- The due date

## Repayment frequency

| Frequency | Due date calculation |
|---|---|
| `monthly` | Same day of month, n months from funding date |
| `weekly` | 7-day intervals from funding date |
| `biweekly` | 14-day intervals from funding date |

The `first_repayment_date` field on the contract can override the first calculated due date. Subsequent dates follow the same interval from that override.

## Schedule item states

| Status | Triggered by |
|---|---|
| `pending` | Default on creation |
| `submitted` | Borrower submits proof (external flow) |
| `confirmed` | Lender confirms or Stripe webhook fires |
| `late` | Background job marks items past their due date |
| `disputed` | Lender raises a dispute |

## Completion check

After every [[link:data-architecture/payments-entity|repayment]] confirmation, the system runs `_try_complete_contract`. This checks whether all schedule items are in a terminal state (`confirmed`). If they are, the contract is set to `COMPLETED` and the completion timestamp is recorded.

## Background job

A scheduled job runs periodically to mark overdue items as `late`. It queries for all `pending` items whose `due_date` is in the past and updates their status.
