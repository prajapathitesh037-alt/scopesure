'use client';

import React from 'react';
import { FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VendorItemStatus } from '@/lib/types';

interface EvidenceViewerProps {
  vendorName: string;
  itemName: string;
  data: VendorItemStatus;
  className?: string;
}

export function EvidenceViewer({ vendorName, itemName, data, className }: EvidenceViewerProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-bg-card p-5 shadow-xs', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary">{itemName}</h4>
          <p className="text-xs text-text-secondary">{vendorName}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary bg-bg-main px-2 py-1 rounded-lg border border-border">
          <FileText className="h-3.5 w-3.5 text-forest" />
          <span className="font-mono text-[11px]">{data.sourceDoc || 'Proposal Document'}</span>
          {data.sourcePage && (
            <span className="ml-1 rounded bg-sage px-1.5 py-0.2 text-[10px] font-bold text-forest">
              p.{data.sourcePage}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-text-primary mb-3 font-medium leading-relaxed">{data.detail}</p>

      {data.evidence ? (
        <div className="rounded-xl bg-sage/30 border border-sage/60 p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-forest mb-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified Source Text
          </div>
          <p className="text-xs text-text-primary font-serif italic leading-relaxed">
            &ldquo;{data.evidence}&rdquo;
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-warning/10 border border-warning/20 p-3">
          <p className="text-xs text-warning font-medium">
            No source evidence available in document for this item.
          </p>
        </div>
      )}
    </div>
  );
}
