'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { ComparisonTable } from '@/components/comparison/comparison-table';
import { FindingDetails } from '@/components/comparison/finding-details';
import { DEMO_COMPARISON, DEMO_FINDINGS, DEMO_VENDORS } from '@/lib/demo-data';
import type { Finding, ComparisonItem, FindingStatus } from '@/lib/types';
import { LiquidButton } from '@/components/liquid/liquid-button';
import { Download, Filter, HelpCircle, XCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ComparisonPage() {
  const router = useRouter();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [activeFilter, setActiveFilter] = useState<FindingStatus | null>(null);

  const handleCellClick = (item: ComparisonItem, vendorId: string) => {
    const existing = DEMO_FINDINGS.find(
      (f) => f.vendorId === vendorId && f.title.toLowerCase().includes(item.item.toLowerCase())
    );

    if (existing) {
      setSelectedFinding(existing);
    } else {
      const v = DEMO_VENDORS.find((vendor) => vendor.id === vendorId);
      const vStatus = item.vendors[vendorId];
      setSelectedFinding({
        id: `custom-${item.id}-${vendorId}`,
        title: `${item.item} Scope Audit`,
        description: `Assessment of ${item.item} quoted by ${v?.name || 'installer'}.`,
        status: vStatus?.status || 'not-specified',
        category: item.category,
        vendorId,
        vendorName: v?.name || 'Solar Installer',
        evidence: vStatus?.evidence || null,
        sourceDoc: vStatus?.sourceDoc || v?.documentName || 'Quotation.pdf',
        sourcePage: vStatus?.sourcePage || '1',
        recommendedAction: `Ask ${v?.name || 'installer'} to clarify equipment warranty and inclusion details for ${item.item}.`,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Side-by-Side Scope Comparison"
        breadcrumbs={[
          { label: 'SCOPEsure', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Comparison' },
        ]}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Vendor Scope Comparison Matrix</h1>
            <p className="text-xs text-text-secondary">
              Evaluate equipment, labor, warranties, and explicit exclusions across all 3 proposals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LiquidButton
              variant="secondary"
              size="md"
              icon={<Download className="h-4 w-4" />}
              onClick={() => router.push('/dashboard/reports')}
            >
              Export Matrix Report
            </LiquidButton>
            <LiquidButton
              variant="primary"
              size="md"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => router.push('/dashboard/findings')}
              className="bg-forest text-white"
            >
              View All Findings
            </LiquidButton>
          </div>
        </div>

        {/* Quick Summary Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveFilter(null)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeFilter === null
                ? 'border-forest bg-pale-green/40 ring-1 ring-forest/20'
                : 'border-border bg-white hover:border-forest/30'
            }`}
          >
            <span className="text-xs text-text-secondary block mb-1">Total Categories</span>
            <span className="text-xl font-bold text-text-primary tabular-nums">8 Items</span>
            <span className="text-[11px] text-forest font-semibold mt-1 block">Full Coverage</span>
          </button>

          <button
            onClick={() => setActiveFilter('not-specified')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeFilter === 'not-specified'
                ? 'border-warning bg-warning/10 ring-1 ring-warning/30'
                : 'border-border bg-white hover:border-warning/30'
            }`}
          >
            <span className="text-xs text-text-secondary block mb-1">Not Specified</span>
            <span className="text-xl font-bold text-warning tabular-nums">5 Omissions</span>
            <span className="text-[11px] text-warning font-semibold mt-1 block">Missing in Quote</span>
          </button>

          <button
            onClick={() => setActiveFilter('excluded')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeFilter === 'excluded'
                ? 'border-error bg-error/10 ring-1 ring-error/30'
                : 'border-border bg-white hover:border-error/30'
            }`}
          >
            <span className="text-xs text-text-secondary block mb-1">Explicit Exclusions</span>
            <span className="text-xl font-bold text-error tabular-nums">1 Critical</span>
            <span className="text-[11px] text-error font-semibold mt-1 block">Panel Upgrade</span>
          </button>

          <button
            onClick={() => setActiveFilter('conflicting')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeFilter === 'conflicting'
                ? 'border-error bg-error/10 ring-1 ring-error/30'
                : 'border-border bg-white hover:border-error/30'
            }`}
          >
            <span className="text-xs text-text-secondary block mb-1">Conflicting Terms</span>
            <span className="text-xl font-bold text-error tabular-nums">1 Conflict</span>
            <span className="text-[11px] text-error font-semibold mt-1 block">Warranty Term Gap</span>
          </button>
        </div>

        {/* Data Rule Warning Banner */}
        <div className="rounded-xl bg-sage/35 border border-sage p-3.5 flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-forest" />
            <span>
              <strong>Audit Rule:</strong> &quot;Not specified&quot; indicates missing documentation and is never assumed to be zero cost or an exclusion.
            </span>
          </div>
          <span className="text-forest font-semibold">100% Citations Verified</span>
        </div>

        {/* Comparison Table Component */}
        <ComparisonTable
          filterStatus={activeFilter}
          onFindingClick={handleCellClick}
        />

        {/* Finding Details Drawer */}
        <FindingDetails
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      </div>
    </div>
  );
}
