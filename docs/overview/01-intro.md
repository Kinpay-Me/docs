---
id: intro
number: 1
title: Introduction
category: overview
categoryTitle: Overview
---

## What is KinPay

KinPay is a peer-to-peer lending platform built for trust-based informal loans between people who already know each other — family, friends, colleagues, and community members.

The platform formalises agreements that have traditionally lived in verbal promises and WhatsApp messages. KinPay gives both sides of a loan a shared, auditable record: the terms they agreed to, a signed digital contract, a repayment schedule, and a confirmation trail for every payment made.

## Target market

KinPay is Africa-first. The initial corridors are Nigeria, Ghana, and Kenya, with the broader remit being any market where informal lending between trusted parties is common and where the absence of formal structure creates friction and disputes.

## Core product concept

A borrower requests a loan and specifies the amount, duration, repayment structure, and interest rate. They share the request with a lender — via a direct link, a username, or an email invitation to someone not yet on KinPay.

The lender reviews the terms, negotiates if needed, and accepts. Both parties digitally sign the contract. The lender funds the loan — either manually outside the platform (external funding) or directly through [[link:integrations/stripe|Stripe Connect]] (integrated funding). Repayments follow the [[link:architecture/loan-lifecycle|agreed schedule]]. The lender confirms each repayment, or Stripe auto-confirms when repayments go through the platform.

## Key principles

- **Trust-first** — the platform assumes both parties are known to each other, so it prioritises transparency over credit scoring.
- **Borrower-initiated** — loan requests always start with the borrower specifying terms, not the lender posting an offer.
- **Dual confirmation** — every repayment has a two-sided ack model: the borrower submits proof, the lender confirms receipt. Stripe-integrated repayments skip this step and are auto-confirmed.
- **Audit trail** — every state change is recorded with a timestamp, actor, and context in the [[link:data-architecture/audit-log|audit log]]. The trail is append-only and cannot be modified.
