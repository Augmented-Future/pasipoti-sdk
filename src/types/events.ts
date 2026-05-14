export type PlatformEvent =
  | 'partner.applied'
  | 'partner.approved'
  | 'partner.rejected'
  | 'package.version.approved'
  | 'package.installed'
  | 'org.invoice.paid';

export interface WebhookPayload<T extends PlatformEvent = PlatformEvent> {
  event: T;
  timestamp: string;  // ISO 8601
  data: Record<string, unknown>;
}
