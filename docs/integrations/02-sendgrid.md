---
id: sendgrid
number: 2
title: SendGrid
category: integrations
---

## Overview

KinPay uses SendGrid for all transactional emails. Emails are sent using the SendGrid Web API v3 — not SMTP.

## Environment variables

| Variable | Description |
|---|---|
| `SENDGRID_API_KEY` | SendGrid API key (`SG.xxx`) |
| `SENDGRID_FROM_EMAIL` | Verified sender address (e.g. `hello@kinpay.me`) |
| `SENDGRID_FROM_NAME` | Sender display name (e.g. `KinPay`) |

## Sender verification

The `SENDGRID_FROM_EMAIL` domain must be verified in SendGrid (Domain Authentication). Without this, emails will be rejected or land in spam.

To verify: SendGrid Dashboard → Settings → Sender Authentication → Authenticate Your Domain.

## Emails sent

| Email | Recipient | Trigger |
|---|---|---|
| Loan request received | Lender | Borrower shares a request with a registered lender |
| Loan funded (green) | Borrower | Contract transitions to [[link:architecture/loan-lifecycle|ACTIVE]] |
| Repayment received (indigo) | Lender | Borrower submits external repayment proof |
| Repayment confirmed (green) | Borrower | Lender confirms repayment, or Stripe auto-confirms |
| Invite email | Invited email | Borrower shares request with unregistered email |
| OTP / verification | User | Registration, login, password reset |

## Email theme colours

| Theme | Hex | Used for |
|---|---|---|
| Green | `#16a34a` | Confirmed/completed actions — loan funded, repayment confirmed |
| Indigo | `#4f46e5` | Action required — repayment received, awaiting lender confirmation |

## Failure handling

Email sends use `_safe_send` which catches all exceptions and logs them without re-raising. If an email fails to send, the webhook or API call still returns success — the payment transaction is not rolled back.

To debug email failures: search server logs for `[LoanEmailService] Failed to send`. If found, check `SENDGRID_API_KEY` validity and sender domain verification status. For the full environment variable reference, see [[link:deployment/environment|Environment Variables]].
