'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { DEMO_FINDINGS, DEMO_VENDORS } from '@/lib/demo-data';
import { FindingDetails } from '@/components/comparison/finding-details';
import { LiquidButton } from '@/components/liquid/liquid-button';
import { LiquidSurface } from '@/components/liquid/liquid-surface';
import {
  AlertTriangle,
  HelpCircle,
  XCircle,
  GitCompare,
  CheckCircle2,
  FileText,
  MessageSquare,
  Search,
  Filter,
  Copy,
  ExternalLink,
} from 'lucide-react';
import type { Finding, FindingStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>(DEMO_FINDINGS);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filterType !== 'all' && f.status !== filterType) return false;
    if (selectedVendor !== 'all' && f.vendorId !== selectedVendor) return false;
    return true;
  });

  const handleCopyAction = (f: Finding) => {
    navigator.clipboard.writeText(
      `Clarification Request regarding "${f.title}":\n${f.recommendedAction}\n(Ref: ${f.sourceDoc})`
    );
    setCopiedId(f.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Audit Findings & Clarifications"
        breadcrumbs={[
          { label: 'SCOPEsure', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Findings' },
        ]}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Identified Scope Differences & Missing Terms
            </h1>
            <p className="text-xs text-text-secondary">
              Review line-item findings, source document citations, and generate actionable clarification inquiries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary bg-white px-3 py-1.5 rounded-xl border border-border">
              {filteredFindings.length} findings displayed
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-border shadow-xs">
          {/* Status filter tabs */}
          <div className="flex items-center flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Findings' },
              { id: 'not-specified', label: 'Missing Info (5)', icon: HelpCircle },
              { id: 'excluded', label: 'Exclusions (1)', icon: XCircle },
              { id: 'conflicting', label: 'Conflicts (1)', icon: GitCompare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5',
                  filterType === tab.id
                    ? 'bg-forest text-white shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
                )}
              >
                {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Vendor Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-secondary font-medium">Filter Vendor:</span>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="rounded-xl border border-border bg-bg-main px-3 py-1.5 text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="all">All Vendors</option>
              {DEMO_VENDORS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const isMissing = finding.status === 'not-specified';
            const isExcluded = finding.status === 'excluded';
            const isConflict = finding.status === 'conflicting';

            return (
              <LiquidSurface
                key={finding.id}
                intensity="subtle"
                onClick={() => setSelectedFinding(finding)}
                className="rounded-2xl border border-border bg-white p-6 hover:border-forest/40 transition-all shadow-xs flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Category & Status Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                        {finding.category}
                      </span>
                      <span className="text-text-secondary">•</span>
                      <span className="text-xs font-semibold text-text-primary">
                        {finding.vendorName}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1',
                        isMissing && 'bg-warning/15 text-warning',
                        isExcluded && 'bg-error/15 text-error',
                        isConflict && 'bg-error/15 text-error',
                        finding.status === 'unclear' && 'bg-warning/15 text-warning',
                        finding.status === 'included' && 'bg-pale-green text-forest'
                      )}
                    >
                      {isMissing && <HelpCircle className="h-3.5 w-3.5" />}
                      {isExcluded && <XCircle className="h-3.5 w-3.5" />}
                      {isConflict && <GitCompare className="h-3.5 w-3.5" />}
                      <span className="capitalize">{finding.status.replace('-', ' ')}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-text-primary group-hover:text-forest transition-colors">
                    {finding.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                    {finding.description}
                  </p>

                  {/* Evidence Box */}
                  <div className="mt-4 rounded-xl bg-bg-main p-3.5 border border-border">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
                      <span className="font-semibold text-text-primary flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-forest" />
                        {finding.sourceDoc || 'Quotation Document'}
                        {finding.sourcePage && ` (Page ${finding.sourcePage})`}
                      </span>
                      <span>Verified Citation</span>
                    </div>
                    {finding.evidence ? (
                      <p className="text-xs font-serif italic text-text-primary mt-1">
                        &ldquo;{finding.evidence}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-warning font-medium mt-1">
                        No reference found in proposal. Line item not specified by installer.
                      </p>
                    )}
                  </div>
                </div>

                {/* Recommended Action & Actions */}
                <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-forest">Recommended Action: </span>
                    <span className="text-text-primary font-medium">{finding.recommendedAction}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAction(finding);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-bg-main hover:bg-sage/30 px-3 py-1.5 rounded-xl border border-border transition-colors font-medium"
                    >
                      {copiedId === finding.id ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Clarification</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFinding(finding);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline px-2 py-1"
                    >
                      <span>Inspect Details</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </LiquidSurface>
            );
          })}
        </div>

        {/* Evidence & Clarification Drawer */}
        <FindingDetails
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      </div>
    </div>
  );
}
