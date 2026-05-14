import { createHmac } from 'crypto';
import type { PlatformEvent, PlatformEventPayloads, WebhookPayload } from './types/events';

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,   // value of X-Pasipoti-Signature header
  secret: string,
): boolean {
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

export function parseWebhookPayload<T extends PlatformEvent>(raw: string): WebhookPayload<T> {
  return JSON.parse(raw) as WebhookPayload<T>;
}

// ─── Handler registry ─────────────────────────────────────────────────────────

type EventHandler<T extends PlatformEvent> = (
  data: T extends keyof PlatformEventPayloads ? PlatformEventPayloads[T] : Record<string, unknown>,
  payload: WebhookPayload<T>,
) => void | Promise<void>;

type HandlerMap = {
  [K in PlatformEvent]?: EventHandler<K>;
};

/**
 * Build a webhook receiver that verifies the signature and dispatches to typed
 * per-event handlers.  Works with any Node.js HTTP framework — pass the raw
 * request body as a string.
 *
 * @example
 * const handle = createWebhookHandler({
 *   secret: process.env.PASIPOTI_WEBHOOK_SECRET!,
 *   handlers: {
 *     'org.invoice.paid': (data) => console.log('Invoice paid', data.invoiceId),
 *   },
 * });
 *
 * // Express:
 * app.post('/webhooks/pasipoti', express.raw({ type: '*\/*' }), (req, res) => {
 *   const sig = req.headers['x-pasipoti-signature'] as string;
 *   handle(req.body.toString(), sig).then(() => res.sendStatus(200));
 * });
 */
export function createWebhookHandler(options: {
  secret: string;
  handlers: HandlerMap;
  onInvalidSignature?: () => void;
}) {
  return async function handle(rawBody: string, signature: string): Promise<void> {
    if (!verifyWebhookSignature(rawBody, signature, options.secret)) {
      if (options.onInvalidSignature) {
        options.onInvalidSignature();
      } else {
        throw new Error('Invalid webhook signature');
      }
      return;
    }

    const payload = parseWebhookPayload(rawBody);
    const event = payload.event as PlatformEvent;
    const handler = options.handlers[event] as EventHandler<typeof event> | undefined;
    if (handler) {
      await handler(payload.data as any, payload as any);
    }
  };
}
