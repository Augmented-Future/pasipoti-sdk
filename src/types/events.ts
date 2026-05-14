// All platform events the Pasipoti event bus can emit.
// Keep in sync with EventBusService.PlatformEvent in coucouLearnAPI.
export type PlatformEvent =
  | 'partner.applied'
  | 'partner.approved'
  | 'partner.rejected'
  | 'package.version.approved'
  | 'package.installed'
  | 'org.invoice.paid';

// ─── Per-event payload shapes ─────────────────────────────────────────────────

export interface PartnerAppliedPayload {
  partnerId: number;
  organizationId: number;
  tier: string;
}

export interface PartnerApprovedPayload {
  partnerId: number;
  tier: string;
  revenueShareRate: number;
  approvedByAdminId: number;
}

export interface PartnerRejectedPayload {
  partnerId: number;
  notes: string;
  rejectedByAdminId: number;
}

export interface PackageVersionApprovedPayload {
  packageId: number;
  versionId: number;
  version: string;
  approvedByAdminId: number;
}

export interface PackageInstalledPayload {
  packageId: number;
  versionId: number;
  organizationId: number;
  installedAt: string;
}

export interface OrgInvoicePaidPayload {
  organizationId: number;
  invoiceId: number;
  amount: number;
  currency: string;
  paidAt: string;
}

export interface PlatformEventPayloads {
  'partner.applied': PartnerAppliedPayload;
  'partner.approved': PartnerApprovedPayload;
  'partner.rejected': PartnerRejectedPayload;
  'package.version.approved': PackageVersionApprovedPayload;
  'package.installed': PackageInstalledPayload;
  'org.invoice.paid': OrgInvoicePaidPayload;
}

export interface WebhookPayload<T extends PlatformEvent = PlatformEvent> {
  event: T;
  timestamp: string;
  data: T extends keyof PlatformEventPayloads
    ? PlatformEventPayloads[T]
    : Record<string, unknown>;
}
