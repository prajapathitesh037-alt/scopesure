'use client';

import React, { useState } from 'react';
import { DEMO_COMPARISON, DEMO_VENDORS } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, GitCompare, ExternalLink, Filter } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';
import type { FindingStatus, ComparisonItem } from '@/lib/types';

const statusConfig: Record<FindingStatus, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; label: string }> = {
  'included': { icon: CheckCircle2, color: 'text-forest', bgColor: 'bg-pale-green', label: 'Included' },
  'excluded': { icon: XCircle, color: 'text-error', bgColor: 'bg-error/10', label: 'Excluded' },
  'not-specified': { icon: HelpCircle, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Not Specified' },
  'unclear': { icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Unclear' },
  'conflicting': { icon: GitCompare, color: 'text-error', bgColor: 'bg-error/10', label: 'Conflicting' },
};

interface ComparisonTableProps {
  onFindingClick?: (item: ComparisonItem, vendorId: string) => void;
  filterStatus?: FindingStatus | null;
}

export function ComparisonTable({ onFindingClick, filterStatus: externalFilter }: ComparisonTableProps) {
  const [sortBy, setSortBy] = useState<'item' | 'category'>('category');
  const [internalFilter, setInternalFilter] = useState<FindingStatus | 'all'>('all');

  const activeFilter = externalFilter || (internalFilter === 'all' ? null : internalFilter);

  const filteredItems = activeFilter
    ? DEMO_COMPARISON.filter((item) =>
        Object.values(item.vendors).some((v) => v.status === activeFilter)
      )
    : DEMO_COMPARISON;

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return a.item.localeCompare(b.item);
  });

  return (
    <div className="rounded-2xl bg-bg-card border border-border shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Scope Audit Matrix</h3>
          <span className="text-xs text-text-secondary bg-sage/40 px-2.5 py-0.5 rounded-full font-medium">
            {sortedItems.length} items evaluated
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick filter buttons */}
          <div className="flex items-center gap-1 bg-bg-main p-1 rounded-xl text-xs">
            <button
              onClick={() => setInternalFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-lg font-medium transition-all',
                internalFilter === 'all' ? 'bg-white text-forest shadow-xs' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              All Items
            </button>
            <button
              onClick={() => setInternalFilter('not-specified')}
              className={cn(
                'px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1',
                internalFilter === 'not-specified' ? 'bg-warning/15 text-warning font-semibold' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <HelpCircle className="h-3 w-3" /> Missing Specs
            </button>
            <button
              onClick={() => setInternalFilter('excluded')}
              className={cn(
                'px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1',
                internalFilter === 'excluded' ? 'bg-error/15 text-error font-semibold' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <XCircle className="h-3 w-3" /> Exclusions
            </button>
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Grouping */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSortBy('category')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                sortBy === 'category' ? 'bg-forest/10 text-forest' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              By Category
            </button>
            <button
              onClick={() => setSortBy('item')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                sortBy === 'item' ? 'bg-forest/10 text-forest' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              By Item
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-bg-main/60">
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-1/4">
                Equipment & Scope Item
              </th>
              {DEMO_VENDORS.map((vendor) => (
                <th
                  key={vendor.id}
                  className="px-4 py-3.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-1/4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: vendor.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-text-primary normal-case font-bold">{vendor.name}</span>
                      <span className="text-[10px] text-text-secondary font-mono">${vendor.quotedPrice?.toLocaleString() ?? 'N/A'}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {sortedItems.map((item) => (
              <tr key={item.id} className="group hover:bg-sage/15 transition-colors">
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary">{item.item}</span>
                    <span className="text-xs text-text-secondary mt-0.5 inline-block font-medium">{item.category}</span>
                  </div>
                </td>
                {DEMO_VENDORS.map((vendor) => {
                  const vendorStatus = item.vendors[vendor.id];
                  if (!vendorStatus) {
                    return (
                      <td key={vendor.id} className="px-4 py-4 align-top text-xs text-text-secondary">
                        —
                      </td>
                    );
                  }
                  const config = statusConfig[vendorStatus.status];
                  const Icon = config.icon;

                  return (
                    <td key={vendor.id} className="px-4 py-4 align-top">
                      <LiquidSurface
                        intensity="subtle"
                        onClick={() => onFindingClick?.(item, vendor.id)}
                        className={cn(
                          'flex flex-col gap-1.5 rounded-xl p-3 text-xs transition-all border cursor-pointer group/cell hover:shadow-xs',
                          config.bgColor,
                          vendorStatus.status === 'included' && 'border-forest/20',
                          vendorStatus.status === 'not-specified' && 'border-warning/30',
                          vendorStatus.status === 'excluded' && 'border-error/30',
                          vendorStatus.status === 'unclear' && 'border-warning/30',
                          vendorStatus.status === 'conflicting' && 'border-error/30'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Icon className={cn('h-3.5 w-3.5 shrink-0', config.color)} />
                            <span className={cn('font-semibold capitalize', config.color)}>{config.label}</span>
                          </div>
                          {vendorStatus.evidence && (
                            <span className="text-[10px] text-text-secondary flex items-center gap-0.5 opacity-60 group-hover/cell:opacity-100 font-mono">
                              Doc Ref <ExternalLink className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                        {vendorStatus.detail && (
                          <p className="text-[11px] text-text-primary leading-snug line-clamp-2">
                            {vendorStatus.detail}
                          </p>
                        )}
                        {vendorStatus.sourcePage && (
                          <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
                            <span className="rounded bg-white/70 px-1.5 py-0.2 border border-border">
                              p. {vendorStatus.sourcePage}
                            </span>
                          </div>
                        )}
                      </LiquidSurface>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
