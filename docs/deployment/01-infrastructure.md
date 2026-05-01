---
id: infrastructure
number: 1
title: Infrastructure
category: deployment
categoryTitle: Deployment
---

## Architecture diagram

```
Internet
    │
    ▼
Route 53 (DNS)
    │
    ├── api.kinpay.me ──→ ALB ──→ ECS Fargate (backend)
    │                               │
    │                               ├── RDS PostgreSQL
    │                               ├── S3 (files)
    │                               ├── Stripe API
    │                               └── SendGrid API
    │
    ├── app.kinpay.me ──→ Static hosting (frontend app)
    │
    └── dashboard.kinpay.me ──→ Static hosting (dashboard)
```

## Backend (ECS Fargate)

The FastAPI backend runs in Docker containers on [[link:integrations/aws|AWS ECS Fargate]]. There is no EC2 fleet to manage — Fargate provisions compute on demand.

The container image is built from the `kinpay-backend` repo and pushed to ECR on every deployment. ECS pulls the new image and performs a rolling update with zero downtime.

**Health check endpoint:** `GET /health` — returns `200 OK` if the service is running and the database is reachable.

## Database (RDS PostgreSQL)

Managed PostgreSQL 15 on AWS RDS. The database is in the same VPC as the ECS tasks and is not publicly accessible — only the ECS security group can connect.

**Connection URL format:**
```
postgresql+asyncpg://user:password@host:5432/kinpay
```

Managed via Alembic migrations. To apply pending migrations:
```bash
alembic upgrade head
```

## File storage (S3)

All user-uploaded files and generated PDFs are stored in [[link:integrations/aws|S3]]. Files are private. The backend generates time-limited pre-signed URLs (15 minutes) for clients to upload or download files directly.

## TLS / SSL

TLS certificates are managed by AWS ACM and attached to the ALB. Certificate renewal is automatic. The ALB terminates TLS and forwards HTTP to the ECS tasks.

## CI/CD

Deployments are triggered by pushes to the `main` branch:

1. GitHub Actions builds the Docker image
2. Image is pushed to ECR
3. ECS service is updated to use the new image
4. ECS performs a rolling deployment (keeps old tasks running until new ones pass health checks)
