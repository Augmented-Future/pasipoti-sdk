// ─── Partner types ────────────────────────────────────────────────────────────

export interface PartnerProfile {
  id: number;
  organizationId: number;
  tier: 'registered' | 'silver' | 'gold' | 'platinum';
  kycStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  revenueShareRate: number;
  authorisedRegions: string[] | null;
  contractRef: string | null;
  createdAt: string;
}

// ─── Ledger types ─────────────────────────────────────────────────────────────

export interface LedgerPeriodSummary {
  period: string;         // YYYY-MM
  totalAmount: number;
  count: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface LedgerRow {
  id: number;
  partnerId: number;
  organizationId: number | null;
  sourceType: 'subscription_share' | 'package_share' | 'bonus';
  period: string;         // YYYY-MM
  grossAmount: number;
  revenueShareRate: number;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'reversed';
  approvedAt: string | null;
  paidAt: string | null;
  externalRef: string | null;
  notes: string | null;
  createdAt: string;
}

// ─── Marketplace / package types ──────────────────────────────────────────────

export interface PackageListing {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  kind: 'managed' | 'unmanaged';
  status: 'published';
  category: string | null;
  homepageUrl: string | null;
  publisherOrgId: number;
  publisher: { id: number; name: string } | null;
  versions: PackageVersion[];
}

export interface PackageVersion {
  id: number;
  version: string;
  manifest: string;
  status: 'approved';
  artifactUrl: string | null;
  signature: string | null;
  changelog: string | null;
}

export interface PackageManifest {
  name: string;
  version: string;
  description: string;
  slots: string[];
  events: string[];
  scopes: string[];
  configSchema?: Record<string, { type: string; label: string; required?: boolean }>;
  i18n?: string[];
}

export interface OrgInstall {
  id: number;
  packageVersionId: number;
  organizationId: number;
  enabled: boolean;
  installedAt: string;
  consentedScopes: string | null;
}

// ─── ISV publisher types ──────────────────────────────────────────────────────

export interface IsvPackage {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  kind: 'managed' | 'unmanaged';
  status: string;
  category: string | null;
  homepageUrl: string | null;
  publisherOrgId: number;
  createdAt: string;
}

export interface IsvPackageVersion {
  id: number;
  packageId: number;
  version: string;
  manifest: string;
  status: 'pending' | 'approved' | 'rejected';
  changelog: string | null;
  artifactUrl: string | null;
  signature: string | null;
  escrowRef: string | null;
  submittedAt: string;
}

// Pagination wrapper
export interface Paginated<T> {
  rows: T[];
  count: number;
  pages: number;
  page: number;
  pageSize: number;
}
