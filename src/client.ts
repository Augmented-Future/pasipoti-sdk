import type {
  PartnerProfile,
  PackageListing,
  PackageManifest,
  OrgInstall,
  LedgerRow,
  LedgerPeriodSummary,
  IsvPackage,
  IsvPackageVersion,
  Paginated,
} from './types/api';

export interface PasipotiClientOptions {
  baseUrl: string;
  token: string;
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
    const body = await res.json() as { data?: T };
    return (body.data ?? body) as T;
  }

  // ─── Partner self-service ─────────────────────────────────────────────────

  getPartnerProfile(): Promise<PartnerProfile> {
    return this.request('/api/v1/partner/me');
  }

  getLedgerSummary(): Promise<LedgerPeriodSummary[]> {
    return this.request('/api/v1/partner/ledger/summary');
  }

  listLedger(params?: {
    page?: number;
    status?: 'pending' | 'approved' | 'paid' | 'reversed';
    period?: string;
  }): Promise<Paginated<LedgerRow>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.status) qs.set('status', params.status);
    if (params?.period) qs.set('period', params.period);
    const q = qs.toString();
    return this.request(`/api/v1/partner/ledger${q ? `?${q}` : ''}`);
  }

  // ─── Webhook subscriptions ────────────────────────────────────────────────

  subscribeWebhook(targetUrl: string, secret: string, events: string[]): Promise<{ id: number }> {
    return this.request('/api/v1/webhooks', {
      method: 'POST',
      body: JSON.stringify({ targetUrl, secret, events }),
    });
  }

  listWebhooks(): Promise<{ id: number; targetUrl: string; events: string[]; isActive: boolean }[]> {
    return this.request('/api/v1/webhooks');
  }

  deleteWebhook(subId: number): Promise<void> {
    return this.request(`/api/v1/webhooks/${subId}`, { method: 'DELETE' });
  }

  // ─── Marketplace (org consumer) ───────────────────────────────────────────

  listMarketplacePackages(): Promise<{ count: number; rows: PackageListing[] }> {
    return this.request('/api/v1/marketplace/packages');
  }

  getPackageManifest(versionId: number): Promise<PackageManifest> {
    return this.request(`/api/v1/marketplace/packages/${versionId}/manifest`);
  }

  listOrgInstalls(): Promise<{ installedVersionIds: number[] }> {
    return this.request('/api/v1/marketplace/installs');
  }

  installPackage(
    versionId: number,
    consentedScopes: string[],
    configJson?: Record<string, string | boolean | number>,
  ): Promise<OrgInstall> {
    return this.request(`/api/v1/marketplace/packages/${versionId}/install`, {
      method: 'POST',
      body: JSON.stringify({ consentedScopes, configJson: configJson ?? null }),
    });
  }

  uninstallPackage(versionId: number): Promise<void> {
    return this.request(`/api/v1/marketplace/packages/${versionId}/install`, {
      method: 'DELETE',
    });
  }

  // ─── ISV publisher ────────────────────────────────────────────────────────

  createPackage(body: {
    slug: string;
    name: string;
    description?: string;
    kind?: 'managed' | 'unmanaged';
    category?: string;
    homepageUrl?: string;
  }): Promise<IsvPackage> {
    return this.request('/api/v1/isv/packages', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  listMyPackages(page = 1): Promise<Paginated<IsvPackage>> {
    return this.request(`/api/v1/isv/packages?page=${page}`);
  }

  publishVersion(
    packageId: number,
    body: {
      version: string;
      manifest: string;
      changelog?: string;
      artifactUrl?: string;
      signature?: string;
      escrowRef?: string;
    },
  ): Promise<IsvPackageVersion> {
    return this.request(`/api/v1/isv/packages/${packageId}/versions`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  listVersions(packageId: number): Promise<IsvPackageVersion[]> {
    return this.request(`/api/v1/isv/packages/${packageId}/versions`);
  }
}
