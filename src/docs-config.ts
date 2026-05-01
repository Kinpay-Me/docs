import { parseMarkdownDocs, organizeSidebar } from "@jestrux/docs-viewer/parser";
import type { DocsConfig } from "@jestrux/docs-viewer";

// ── Overview ──────────────────────────────────────────────────────────────────
import intro from "../docs/overview/01-intro.md?raw";

// ── Architecture ──────────────────────────────────────────────────────────────
import systemOverview from "../docs/architecture/01-system-overview.md?raw";
import backendModules from "../docs/architecture/02-backend-modules.md?raw";
import loanLifecycle from "../docs/architecture/03-loan-lifecycle.md?raw";

// ── Data Architecture ─────────────────────────────────────────────────────────
import usersEntity from "../docs/data-architecture/01-users.md?raw";
import loansEntity from "../docs/data-architecture/02-loans.md?raw";
import participants from "../docs/data-architecture/03-participants.md?raw";
import contractsEntity from "../docs/data-architecture/04-contracts.md?raw";
import paymentsEntity from "../docs/data-architecture/05-payments.md?raw";
import schedules from "../docs/data-architecture/06-schedules.md?raw";
import auditLog from "../docs/data-architecture/07-audit-log.md?raw";
import trustSystem from "../docs/data-architecture/08-trust.md?raw";

// ── API Reference ─────────────────────────────────────────────────────────────
import apiAuth from "../docs/api-reference/01-auth.md?raw";
import apiLoans from "../docs/api-reference/02-loans.md?raw";
import apiContracts from "../docs/api-reference/03-contracts.md?raw";
import apiPayments from "../docs/api-reference/04-payments.md?raw";
import apiAdmin from "../docs/api-reference/05-admin.md?raw";

// ── Integrations ──────────────────────────────────────────────────────────────
import stripe from "../docs/integrations/01-stripe.md?raw";
import sendgrid from "../docs/integrations/02-sendgrid.md?raw";
import aws from "../docs/integrations/03-aws.md?raw";

// ── Deployment ────────────────────────────────────────────────────────────────
import infrastructure from "../docs/deployment/01-infrastructure.md?raw";
import environment from "../docs/deployment/02-environment.md?raw";

const files = [
  { content: intro, path: "overview/01-intro.md" },
  { content: systemOverview, path: "architecture/01-system-overview.md" },
  { content: backendModules, path: "architecture/02-backend-modules.md" },
  { content: loanLifecycle, path: "architecture/03-loan-lifecycle.md" },
  { content: usersEntity, path: "data-architecture/01-users.md" },
  { content: loansEntity, path: "data-architecture/02-loans.md" },
  { content: participants, path: "data-architecture/03-participants.md" },
  { content: contractsEntity, path: "data-architecture/04-contracts.md" },
  { content: paymentsEntity, path: "data-architecture/05-payments.md" },
  { content: schedules, path: "data-architecture/06-schedules.md" },
  { content: auditLog, path: "data-architecture/07-audit-log.md" },
  { content: trustSystem, path: "data-architecture/08-trust.md" },
  { content: apiAuth, path: "api-reference/01-auth.md" },
  { content: apiLoans, path: "api-reference/02-loans.md" },
  { content: apiContracts, path: "api-reference/03-contracts.md" },
  { content: apiPayments, path: "api-reference/04-payments.md" },
  { content: apiAdmin, path: "api-reference/05-admin.md" },
  { content: stripe, path: "integrations/01-stripe.md" },
  { content: sendgrid, path: "integrations/02-sendgrid.md" },
  { content: aws, path: "integrations/03-aws.md" },
  { content: infrastructure, path: "deployment/01-infrastructure.md" },
  { content: environment, path: "deployment/02-environment.md" },
];

const categories = parseMarkdownDocs(files);

const sidebarSections = organizeSidebar(categories, [
  { title: "", categoryIds: ["overview"] },
  { title: "Architecture", categoryIds: ["architecture"] },
  { title: "Data Architecture", categoryIds: ["data-architecture"] },
  { title: "API Reference", categoryIds: ["api-reference"] },
  { title: "Integrations", categoryIds: ["integrations"] },
  { title: "Deployment", categoryIds: ["deployment"] },
]);

export const docsConfig: DocsConfig = {
  title: "KinPay Docs",
  subtitle: "Technical reference",
  sections: sidebarSections,
  ai: true,
  entities: [
    {
      keywords: ["stripe", "payment intent", "checkout", "connect", "integrations"],
      path: "integrations/stripe",
      label: "Stripe Integration",
      description: "PaymentIntents, Connect, webhooks",
    },
    {
      keywords: ["sendgrid", "email", "transactional", "integrations"],
      path: "integrations/sendgrid",
      label: "SendGrid",
      description: "Transactional email templates",
    },
    {
      keywords: ["aws", "s3", "ecs", "rds", "cloudfront", "fargate", "integrations"],
      path: "integrations/aws",
      label: "AWS",
      description: "S3, ECS Fargate, RDS, CloudFront",
    },
    {
      keywords: ["loan lifecycle", "state machine", "contract states", "loan states", "loans", "status", "transitions"],
      path: "architecture/loan-lifecycle",
      label: "Loan Lifecycle",
      description: "State transitions for loans, contracts and repayments",
    },
    {
      keywords: ["backend modules", "service layer", "modules", "architecture", "services", "fastapi", "python"],
      path: "architecture/backend-modules",
      label: "Backend Modules",
      description: "Vertical slice modules and service pattern",
    },
    {
      keywords: ["system overview", "stack", "tech stack", "request lifecycle", "fastapi", "python", "postgres", "react", "overview"],
      path: "architecture/system-overview",
      label: "System Overview",
      description: "High-level stack and request lifecycle",
    },
    {
      keywords: ["auth", "authentication", "jwt", "otp", "login", "register", "token", "password", "session", "refresh", "api"],
      path: "api-reference/api-auth",
      label: "Auth API",
      description: "Registration, OTP, login, JWT, refresh",
    },
    {
      keywords: ["loans api", "loan request", "share link", "loans", "api", "borrow"],
      path: "api-reference/api-loans",
      label: "Loans API",
      description: "Loan request creation, listing, invitations",
    },
    {
      keywords: ["contracts api", "signing", "funding", "repayment", "contracts", "api", "agreement", "lender", "borrower"],
      path: "api-reference/api-contracts",
      label: "Contracts API",
      description: "Signing, funding, repayments, disputes",
    },
    {
      keywords: ["payments api", "webhook", "payment intent", "payments", "api", "stripe webhook"],
      path: "api-reference/api-payments",
      label: "Payments API",
      description: "Stripe PaymentIntent and webhook handling",
    },
    {
      keywords: ["admin", "dashboard", "operator", "user management", "api", "admin panel", "stats", "analytics"],
      path: "api-reference/api-admin",
      label: "Admin API",
      description: "Dashboard queries, user management, stats",
    },
    {
      keywords: ["trust", "trust score", "tier", "scoring", "reputation", "rating", "level"],
      path: "data-architecture/trust-system",
      label: "Trust System",
      description: "Trust score computation and tier management",
    },
    {
      keywords: ["audit log", "audit trail", "audit", "logs", "history", "events"],
      path: "data-architecture/audit-log",
      label: "Audit Log",
      description: "Event logging and audit trail",
    },
    {
      keywords: ["repayment schedule", "schedule", "installment", "repayment", "due date", "payment plan"],
      path: "data-architecture/repayment-schedules",
      label: "Repayment Schedules",
      description: "Schedule items, statuses, due dates",
    },
    {
      keywords: ["users", "profile", "identity", "avatar", "user", "account", "kyc"],
      path: "data-architecture/users-entity",
      label: "Users",
      description: "User profile and legal identity fields",
    },
    {
      keywords: ["environment", "env vars", "env", "config", "secrets", "variables", "dotenv", "keys", "api keys"],
      path: "deployment/environment",
      label: "Environment Variables",
      description: "All environment variables by service",
    },
    {
      keywords: ["infrastructure", "deploy", "deployment", "ecs", "fargate", "ci", "docker", "pipeline", "cd", "github actions"],
      path: "deployment/infrastructure",
      label: "Infrastructure",
      description: "AWS deployment architecture and CI/CD",
    },
  ],
};
