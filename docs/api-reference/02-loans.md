---
id: api-loans
number: 2
title: Loans API
category: api-reference
---

## POST /loans

Create a new [[link:data-architecture/loans-entity|loan request]].

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount_cents` | integer | Yes | Principal in minor units |
| `currency` | string | Yes | e.g. `NGN` |
| `duration_months` | integer | Yes | |
| `repayment_structure` | string | Yes | `lump_sum` or `installments` |
| `repayment_frequency` | string | No | Required for installments: `monthly`, `weekly`, `biweekly` |
| `interest_rate_pct` | number | Yes | Annual rate as a percentage |
| `purpose` | string | No | |
| `first_repayment_date` | string | No | ISO 8601 date |

**Response** — `201 Created` with the new `LoanRequest` object including `short_id`.

---

## GET /loans

List the authenticated user's loan requests. Returns both borrower and lender requests.

**Query params** — `page`, `page_size`, `status`

---

## GET /loans/{id}

Get a single loan request by UUID or `short_id`.

---

## POST /loans/{id}/share

Set the share target for the request.

**Request body**

| Field | Type | Description |
|---|---|---|
| `method` | string | `link`, `username`, or `email` |
| `username` | string | Target username (method=username only) |
| `email` | string | Target email (method=email only) |

If the email is not registered, `invited_email` is set on the request and the invite flow is triggered. See [[link:data-architecture/participants|Participants & Roles]] for how invited lenders are handled.

---

## POST /loans/{id}/counter

Propose modified terms as the lender.

**Request body** — Subset of loan fields to change (amount, duration, rate, structure, frequency).

---

## POST /loans/{id}/accept

Accept the current terms as the lender. Creates a [[link:data-architecture/contracts-entity|contract]] in `PENDING_SIGNATURES` state.

---

## POST /loans/{id}/cancel

Cancel the loan request as the borrower.

---

## GET /loans/public/{short_id}

Public endpoint — no authentication required. Returns the loan request for display on the share page.

Returns an invite-specific payload if `invited_email` is set, indicating whether the visiting user matches the invited email.
