import { createHmac } from 'crypto';
import type { PlatformEvent, WebhookPayload } from './types/events';

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,  // value of X-Pasipoti-Signature header
  secret: string,
): boolean {
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

export function parseWebhookPayload<T extends PlatformEvent>(raw: string): WebhookPayload<T> {
  return JSON.parse(raw) as WebhookPayload<T>;
}
