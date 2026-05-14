import type { PartnerProfile, PackageListing, LedgerSummary } from './types/api';

export interface PasipotiClientOptions {
  baseUrl: string;   // e.g. https://api.learnershood.com
  token: string;     // Bearer JWT
}

export class PasipotiClient {
  private baseUrl: string;
  private token: string;

  constructor(options: PasipotiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.token = options.token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(`Pasipoti API ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  getPartnerProfile(): Promise<PartnerProfile> {
    return this.request('/api/v1/partner/me');
  }

  listMarketplacePackages(): Promise<PackageListing[]> {
    return this.request('/api/v1/marketplace/packages');
  }

  getLedgerSummary(): Promise<LedgerSummary> {
    return this.request('/api/v1/partner/ledger/summary');
  }

  subscribeWebhook(targetUrl: string, secret: string, events: string[]): Promise<{ id: number }> {
    return this.request('/api/v1/webhooks', {
      method: 'POST',
      body: JSON.stringify({ targetUrl, secret, events }),
    });
  }
}
