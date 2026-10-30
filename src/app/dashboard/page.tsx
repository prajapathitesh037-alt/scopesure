'use client';

import React, { useState } from 'react';
import { DashboardHeroBanner } from '@/components/dashboard/dashboard-hero-banner';
import { EquipmentPackCard } from '@/components/dashboard/equipment-pack-card';
import { ScopeProductionChart } from '@/components/dashboard/scope-production-chart';
import { AuditNotificationsCard } from '@/components/dashboard/audit-notifications-card';
import { EnergyMetricsStrip } from '@/components/dashboard/energy-metrics-strip';
import { ScopePowerFlow } from '@/components/dashboard/scope-power-flow';
import { AssetSystemCard } from '@/components/dashboard/asset-system-card';
import { ScopeRiskImpact } from '@/components/dashboard/scope-risk-impact';
import { ComparisonTable } from '@/components/comparison/comparison-table';
import { FindingDetails } from '@/components/comparison/finding-details';
import { DEMO_FINDINGS, DEMO_VENDORS } from '@/lib/demo-data';
import type { Finding, ComparisonItem } from '@/lib/types';
import { ChevronDown, ChevronUp, FileSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const handleFindingClickFromTable = (item: ComparisonItem, vendorId: string) => {
    const matching = DEMO_FINDINGS.find(
      (f) => f.vendorId === vendorId && f.title.toLowerCase().includes(item.item.toLowerCase())
    );

    if (matching) {
      setSelectedFinding(matching);
    } else {
      const v = DEMO_VENDORS.find((vendor) => vendor.id === vendorId);
      const vStatus = item.vendors[vendorId];
      setSelectedFinding({
        id: `gen-${item.id}-${vendorId}`,
        title: `${item.item}: ${vStatus?.detail || 'Status Review'}`,
        description: `Scope assessment for ${item.item} in ${v?.name || 'vendor'} quotation.`,
        status: vStatus?.status || 'not-specified',
        category: item.category,
        vendorId,
        vendorName: v?.name || 'Solar Installer',
        evidence: vStatus?.evidence || null,
        sourceDoc: vStatus?.sourceDoc || v?.documentName || 'Quotation.pdf',
        sourcePage: vStatus?.sourcePage || '1',
        recommendedAction: `Ask ${v?.name || 'the vendor'} to confirm all line items and equipment specs for ${item.item}.`,
      });
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* 1. TOP SAGE GREEN BANNER (Exact Reference Screenshot Match) */}
      <DashboardHeroBanner
        onCompareClick={() => setShowMatrix(true)}
        onUploadClick={() => router.push('/dashboard/quotations')}
      />

      {/* 2. MIDDLE ROW: 3 CARDS (EnergyPack, Energy Production, Solar Panel Notifications) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
        <EquipmentPackCard onClick={() => setShowMatrix(true)} />
        <ScopeProductionChart />
        <AuditNotificationsCard onSelectFinding={() => setSelectedFinding(DEMO_FINDINGS[0])} />
      </div>

      {/* 3. BOTTOM ROW: 3 COLUMNS MATCHING EXACT SCREENSHOT ALIGNMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
        {/* Column 1: Power Flow */}
        <div className="h-full">
          <ScopePowerFlow />
        </div>

        {/* Column 2: 3 Small Metric Pills ON TOP of Asset System Card */}
        <div className="flex flex-col gap-3.5 sm:gap-4 h-full justify-between">
          <EnergyMetricsStrip />
          <div className="flex-1">
            <AssetSystemCard />
          </div>
        </div>

        {/* Column 3: Weather impact */}
        <div className="h-full">
          <ScopeRiskImpact />
        </div>
      </div>

      {/* 4. SCOPEsure Quotation Audit Matrix Expander Bar */}
      <div className="rounded-2xl bg-[#F4F7F2] border border-[#DEE5DC] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#17211D] text-[#72EC81]">
            <FileSearch className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#18241D]">
              SCOPEsure Quotation Audit Matrix
            </h4>
            <p className="text-[11px] text-[#637568] font-medium">
              Compare SunPower, GreenRay, and Apex Solar itemized quotes side-by-side
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMatrix(!showMatrix)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17211D] bg-white border border-[#D5DDD2] px-3.5 py-1.5 rounded-xl hover:bg-[#EAF1E8] transition-colors shadow-2xs cursor-pointer"
        >
          {showMatrix ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Hide Audit Table
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" /> View Scope Audit Table
            </>
          )}
        </button>
      </div>

      {/* Expandable Comparison Table */}
      {showMatrix && (
        <div className="pt-1">
          <ComparisonTable onFindingClick={handleFindingClickFromTable} />
        </div>
      )}

      {/* Evidence & Clarification Drawer */}
      <FindingDetails
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}
