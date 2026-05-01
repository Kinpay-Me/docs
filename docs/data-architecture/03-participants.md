---
id: participants
number: 3
title: Participants & Roles
category: data-architecture
---

## Roles in a loan

Every loan involves exactly two participants:

| Role | Description |
|---|---|
| **Borrower** | Initiates the loan request. Receives funds. Makes repayments. |
| **Lender** | Reviews and accepts the request. Provides funds. Confirms repayments. |

A user can be a borrower in some contracts and a lender in others — the role is per-contract, not per-account.

## How participants are stored

Participants are not stored in a separate table. They are tracked via foreign keys on the relevant tables:

| Table | Borrower column | Lender column |
|---|---|---|
| [[link:data-architecture/loans-entity|`loan_requests`]] | `borrower_id` | `lender_id` (set on acceptance) |
| [[link:data-architecture/contracts-entity|`contracts`]] | `borrower_id` | `lender_id` |

## Invited lenders

When a borrower sends a request to an email that is not registered, the `loan_requests.invited_email` field captures the target address. The lender slot (`lender_id`) remains null until the invited user registers and accepts.

## Visibility rules

- A user can only see loan requests where they are the borrower or the lender.
- A user visiting a share link for a request with an `invited_email` can only proceed if their email matches — everyone else sees a "reserved" screen.
- Repayment proof (uploaded documents) is visible only to the borrower and lender of that contract. Other users, including operators, cannot see the files directly.

## Counterparty privacy

The counterparty's full contact details are never exposed in list views. Only the name and avatar are shown in card previews. Full details are available inside the contract view for participants only.
