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
};
