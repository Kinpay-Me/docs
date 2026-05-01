---
id: api-contracts
number: 3
title: Contracts API
category: api-reference
---

## POST /contracts/{id}/sign

Sign the contract as the authenticated party (borrower or lender).

**Request body** — `signature_data` (base64-encoded signature image, or URL to existing signature)

Both parties must sign before the contract can be funded. See the [[link:architecture/loan-lifecycle|Loan Lifecycle]] for the full contract state machine.

---

## POST /contracts/{id}/fund/external

Mark the contract as funded via an external method (bank transfer, cash, mobile money).

No payment is processed on KinPay. The lender self-certifies that they have transferred the funds.

**Response** — Contract with status `ACTIVE` and a generated repayment schedule.

---

## POST /contracts/{id}/fund/integrated

Create a Stripe PaymentIntent for integrated (on-platform) funding.

**Response** — `{ client_secret }` to mount Stripe's PaymentElement.

The contract is set to `ACTIVE` automatically when [[link:integrations/stripe|Stripe]] fires the `payment_intent.succeeded` webhook.

---

## POST /contracts/{id}/repay/external

Submit a repayment with proof of payment.

**Request body** — `amount_cents`, `schedule_item_id` (optional), `proof` (multipart file upload or URL)

The repayment is created in `submitted` state. The lender must call the confirm endpoint to complete it.

---

## POST /contracts/{id}/repay/integrated

Create a Stripe PaymentIntent for an on-platform repayment.

**Response** — `{ client_secret }`. The repayment is auto-confirmed via webhook when Stripe confirms the transfer to the lender's connected account.

---

## POST /contracts/{id}/repayments/{repaymentId}/confirm

Confirm a submitted repayment as the lender.

Triggers the `repayment.confirmed` audit event, updates the schedule item to `confirmed`, and checks whether the contract is now complete.

---

## POST /contracts/{id}/repayments/{repaymentId}/dispute

Raise a dispute on a submitted repayment as the lender.

**Request body** — `reason` (text)

Sets the repayment and schedule item to `disputed`. Only an admin can resolve disputes.

---

## GET /contracts/{id}

Get full contract detail including repayment schedule, all repayments, and both parties' info.

---

## GET /contracts/{id}/history

Get the [[link:data-architecture/audit-log|loan audit log]] for this contract — all events in chronological order.

---

## GET /contracts/{id}/pdf

Download the signed contract as a PDF. Requires authentication as a participant.
