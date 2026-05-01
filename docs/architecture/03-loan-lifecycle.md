---
id: loan-lifecycle
number: 3
title: Loan Lifecycle
category: architecture
---

## Loan request states

A loan request moves through the following states before a contract is created. Full field definitions are in [[link:data-architecture/loans-entity|Loan Requests]].

| Status | Meaning |
|---|---|
| `DRAFT` | Created but not yet shared with anyone |
| `PENDING` | Shared — waiting for a lender to accept |
| `COUNTERED` | Lender has proposed modified terms |
| `ACCEPTED` | Lender has accepted the terms |
| `ACTIVE` | A contract has been created and both parties signed |
| `CANCELLED` | Borrower cancelled before acceptance |

## Contract states

Once a loan request is accepted, a contract is created and tracks its own status. Full field definitions are in [[link:data-architecture/contracts-entity|Contracts]].

| Status | Meaning |
|---|---|
| `PENDING_SIGNATURES` | Waiting for one or both parties to sign |
| `SIGNED` | Both parties have signed — waiting for funding |
| `ACTIVE` | Funded — repayments are due per schedule |
| `COMPLETED` | All repayments received and confirmed |
| `DEFAULTED` | Marked as defaulted by the operator or the system |

## State machine diagram

```
Loan request:

  DRAFT ──(shared)──▶ PENDING ──(borrower cancels)──────────▶ CANCELLED
                          │
                          ├──(lender accepts)────────────────────────┐
                          │                                           │
                          └──(lender counters)──▶ COUNTERED           │
                                                      │               │
                                           ┌──────────┴────────┐     │
                                     borrower              borrower   │
                                     accepts               declines   │
                                           │                   │      │
                                           ▼                   ▼      │
                                       ACCEPTED            CANCELLED  │
                                           │                          │
                                           └──────────────────────────┘
                                                        │
                                                        ▼
                                                  contract created


Contract:

  PENDING_SIGNATURES ──(both sign)──▶ SIGNED ──(funded)──▶ ACTIVE
                                                               │
                                            ┌──────────────────┤
                                            │                  │
                                     all confirmed        marked default
                                            │                  │
                                            ▼                  ▼
                                       COMPLETED           DEFAULTED


Repayment schedule items:

  PENDING ──▶ SUBMITTED ──▶ CONFIRMED
                  │
                  └──▶ DISPUTED ──▶ (admin resolves) ──▶ CONFIRMED

  PENDING ──▶ LATE  (background job, past due date)
```

## Repayment states

Each item in the [[link:data-architecture/repayment-schedules|repayment schedule]] has its own status:

| Status | Meaning |
|---|---|
| `PENDING` | Not yet due or due but not paid |
| `SUBMITTED` | Borrower submitted proof (external flow only) |
| `CONFIRMED` | Lender confirmed receipt or Stripe auto-confirmed |
| `LATE` | Past due date, not yet confirmed |
| `DISPUTED` | Lender raised a dispute on a submitted repayment |

## Funding paths

Contracts can be funded in two ways:

**External (manual):** The lender transfers money outside KinPay (bank transfer, cash, mobile money) and clicks "Mark as funded" in the app. The contract moves to `ACTIVE` immediately.

**Integrated ([[link:integrations/stripe|Stripe]]):** The lender pays through KinPay's Stripe integration. The backend creates a PaymentIntent; when Stripe fires the `payment_intent.succeeded` webhook, the contract is automatically set to `ACTIVE` and the funded email is sent.

## Repayment paths

Similarly, repayments can flow in two ways:

**External:** The borrower makes a payment outside KinPay, uploads proof, and submits. The lender reviews the proof and confirms (or disputes). On confirmation, the repayment is marked `CONFIRMED` and the schedule is checked for completion.

**Integrated ([[link:integrations/stripe|Stripe]]):** The borrower pays through KinPay. Stripe handles the transfer to the lender's connected account. The `transfer.paid` webhook auto-confirms the repayment — no lender action required.
