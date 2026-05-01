---
id: backend-modules
number: 2
title: Backend Modules
category: architecture
---

## Module overview

The backend is organised as a set of vertical slices. Each module owns its models, schemas, service, and router. Modules call each other's services directly — there is no message bus.

| Module | Responsibilities |
|---|---|
| `auth` | Registration, OTP, login, JWT, refresh, password reset, audit log |
| `users` | Profile management, avatar, legal identity, Stripe Connect onboarding |
| `loans` | Loan request creation, listing, share link, email invitations |
| `contracts` | Signing, funding, repayment, schedule generation, dispute handling |
| `payments` | Stripe PaymentIntent creation, webhook handling, platform fee recording |
| `trust` | Trust score computation, event logging, tier management |
| `admin` | Dashboard queries, user management, audit log access, stats |
| `notifications` | Push notification registration and dispatch (future) |
| `uploads` | S3 pre-signed URL generation, repayment proof attachment |
| `dev` | Test helpers (register-and-verify, flush users) — disabled in production |

API documentation by module: [[link:api-reference/api-auth|auth]], [[link:api-reference/api-loans|loans]], [[link:api-reference/api-contracts|contracts]], [[link:api-reference/api-payments|payments]], [[link:api-reference/api-admin|admin]]. For the trust scoring data model, see [[link:data-architecture/trust-system|Trust System]].

## Dependency flow

```
  ┌─────────────────────────────────────────────────────────┐
  │                     API ROUTERS                          │
  │   /auth · /loans · /contracts · /payments · /admin       │
  └───────────────────────────┬─────────────────────────────┘
                               │  validate inputs, call service
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                   SERVICE LAYER                          │
  │   AuthService · LoanService · ContractService            │
  │   PaymentService · TrustService · AdminService           │
  └───────────────────────────┬─────────────────────────────┘
                               │  async ORM queries
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │            REPOSITORY / DATA ACCESS LAYER                │
  │          SQLAlchemy 2.0 async · Pydantic schemas         │
  └───────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                    CORE  (shared)                        │
  │         config · database · security · middleware        │
  └─────────────────────────────────────────────────────────┘

  Cross-module calls:
  contracts ──▶ loans, payments, trust, uploads
  payments  ──▶ contracts  (webhook callbacks)
  admin     ──▶ auth, loans, contracts, payments
```

## Service pattern

Every module exposes a `*Service` class that receives a `db: AsyncSession` and contains all business logic. Routers are thin: they validate inputs, resolve dependencies, call the service, and return the response.

```python
class ContractService:
    def __init__(self, db: AsyncSession, audit: AuditService) -> None: ...

    async def sign_contract(self, contract_id: UUID, actor: User) -> Contract: ...
    async def fund_external(self, contract_id: UUID, actor: User, ...) -> Contract: ...
    async def record_external_repayment(self, ...) -> Repayment: ...
```

No HTTP knowledge lives in services. All methods raise `KinPayException` on domain errors, which the router translates to the standard error envelope.
