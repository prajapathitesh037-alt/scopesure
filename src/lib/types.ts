export type FindingStatus = 'included' | 'excluded' | 'not-specified' | 'unclear' | 'conflicting';

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'error';

export interface Project {
  id: string;
  name: string;
  location: string;
  systemCapacity: string;
  systemType: string;
  status: AnalysisStatus;
  quotationCount: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  quotedPrice: number | null;
  documentName: string;
  uploadDate: string;
  analysisStatus: AnalysisStatus;
  findingsCount: number;
  missingInfoCount: number;
  color: string;
}

export interface ComparisonItem {
  id: string;
  category: string;
  item: string;
  vendors: Record<string, VendorItemStatus>;
}

export interface VendorItemStatus {
  status: FindingStatus;
  detail: string;
  evidence?: string;
  sourceDoc?: string;
  sourcePage?: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  status: FindingStatus;
  category: string;
  vendorId: string;
  vendorName: string;
  evidence: string | null;
  sourceDoc: string | null;
  sourcePage: string | null;
  recommendedAction: string;
}

export interface MetricCard {
  label: string;
  value: number;
  icon: string;
  description: string;
  href: string;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
};
