export interface PartnerProfile {
  id: number;
  organizationId: number;
  tier: 'registered' | 'silver' | 'gold' | 'platinum';
  kycStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  revenueShareRate: number;
  createdAt: string;
}

export interface PackageListing {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  latestVersion?: string;
}

export interface LedgerSummary {
  totalApprovedRevenue: number;
  totalPendingRevenue: number;
  currency: string;
}
