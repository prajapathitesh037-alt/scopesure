'use client';

import React from 'react';
import { FileText, AlertTriangle, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { LiquidCard } from '@/components/liquid/liquid-card';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Vendor } from '@/lib/types';

interface VendorQuoteCardProps {
  vendor: Vendor;
  selected?: boolean;
  onClick?: () => void;
}

const statusIcons = {
  pending: Clock,
  analyzing: Clock,
  complete: CheckCircle2,
  error: AlertTriangle,
};

export function VendorQuoteCard({ vendor, selected = false, onClick }: VendorQuoteCardProps) {
  const StatusIcon = statusIcons[vendor.analysisStatus];

  return (
    <LiquidCard selected={selected} onClick={onClick} className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${vendor.color}15` }}
          >
            <FileText className="h-5 w-5" style={{ color: vendor.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{vendor.name}</h3>
            <p className="text-xs text-text-secondary">{vendor.documentName}</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-text-secondary" />
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-text-primary tabular-nums">
            {vendor.quotedPrice !== null ? formatCurrency(vendor.quotedPrice) : '—'}
          </span>
          <span className="ml-1 text-xs text-text-secondary">quoted</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <StatusIcon className="h-3.5 w-3.5 text-forest" />
          <span className="capitalize text-text-secondary">{vendor.analysisStatus}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>{vendor.findingsCount} findings</span>
          {vendor.missingInfoCount > 0 && (
            <span className="flex items-center gap-1 text-warning">
              <AlertTriangle className="h-3 w-3" />
              {vendor.missingInfoCount} missing
            </span>
          )}
        </div>
        {vendor.uploadDate && (
          <span className="text-xs text-text-secondary">
            {formatDate(vendor.uploadDate)}
          </span>
        )}
      </div>
    </LiquidCard>
  );
}
