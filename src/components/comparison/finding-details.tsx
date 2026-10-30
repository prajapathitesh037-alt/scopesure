'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Copy, CheckCircle2, AlertTriangle, HelpCircle, XCircle, GitCompare, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiquidButton } from '@/components/liquid/liquid-button';
import type { Finding, FindingStatus } from '@/lib/types';

const statusConfig: Record<FindingStatus, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; label: string }> = {
  'included': { icon: CheckCircle2, color: 'text-forest', bgColor: 'bg-pale-green', label: 'Included' },
  'excluded': { icon: XCircle, color: 'text-error', bgColor: 'bg-error/10', label: 'Excluded' },
  'not-specified': { icon: HelpCircle, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Not Specified' },
  'unclear': { icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/10', label: 'Unclear' },
  'conflicting': { icon: GitCompare, color: 'text-error', bgColor: 'bg-error/10', label: 'Conflicting' },
};

interface FindingDetailsProps {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingDetails({ finding, onClose }: FindingDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState<string>('');
  const [showClarification, setShowClarification] = useState(true);

  if (!finding) return null;

  const config = statusConfig[finding.status];
  const StatusIcon = config.icon;

  const defaultDraft = `Dear ${finding.vendorName} Team,\n\nWe are currently reviewing your quotation (${finding.sourceDoc || 'attached proposal'}) for our rooftop solar installation project.\n\nWe noticed the following item requires clarification:\n"${finding.title}" - ${finding.description}\n\nSpecific clarification requested:\n${finding.recommendedAction}\n\nPlease let us know if this is covered, if additional costs apply, and provide revised documentation if necessary.\n\nBest regards,\nSolar Project Buyer`;

  const messageText = customMsg || defaultDraft;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-bg-main/50">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest/10 text-forest">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Source Evidence Inspector</h3>
                <p className="text-[11px] text-text-secondary">Vendor Quotation Audit Trail</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Finding Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {finding.category} Finding
                </span>
                <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', config.bgColor)}>
                  <StatusIcon className={cn('h-3.5 w-3.5', config.color)} />
                  <span className={config.color}>{config.label}</span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-text-primary leading-tight">{finding.title}</h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{finding.description}</p>
            </div>

            {/* Vendor & Document Metadata */}
            <div className="rounded-xl border border-border bg-bg-main/60 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Quoting Vendor:</span>
                <span className="font-semibold text-text-primary">{finding.vendorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Document Reference:</span>
                <span className="font-mono text-text-primary">{finding.sourceDoc || 'Proposal Document'}</span>
              </div>
              {finding.sourcePage && (
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Specific Page:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-border">Page {finding.sourcePage}</span>
                </div>
              )}
            </div>

            {/* Source Evidence Quote */}
            <div>
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                Exact Document Excerpt
              </label>
              {finding.evidence ? (
                <div className="mt-2 rounded-xl bg-sage/30 border border-sage/60 p-4">
                  <p className="text-xs font-serif text-text-primary italic leading-relaxed">
                    &ldquo;{finding.evidence}&rdquo;
                  </p>
                  <p className="mt-2 text-[10px] text-text-secondary text-right font-medium">
                    Verified from {finding.sourceDoc}
                  </p>
                </div>
              ) : (
                <div className="mt-2 rounded-xl bg-warning/10 border border-warning/30 p-4">
                  <p className="text-xs text-warning font-medium">
                    No explicit mention found in {finding.sourceDoc}. The vendor did not specify terms for this scope item.
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    Standard industry practice requires explicit warranty & mounting specifications to ensure structural compliance.
                  </p>
                </div>
              )}
            </div>

            {/* Recommended Action */}
            <div className="rounded-xl bg-pale-green/70 border border-forest/20 p-4">
              <label className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Recommended Auditor Action
              </label>
              <p className="text-xs text-text-primary leading-relaxed font-medium">
                {finding.recommendedAction}
              </p>
            </div>

            {/* Clarification Generator */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-forest" />
                  Vendor Clarification Draft
                </label>
                <button
                  onClick={() => setShowClarification(!showClarification)}
                  className="text-xs text-forest hover:underline font-medium"
                >
                  {showClarification ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {showClarification && (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    value={messageText}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg-main p-3 text-xs text-text-primary font-sans leading-relaxed focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <div className="flex items-center gap-2">
                    <LiquidButton
                      variant="primary"
                      size="sm"
                      icon={copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      onClick={handleCopy}
                    >
                      {copied ? 'Copied to Clipboard' : 'Copy Clarification Email'}
                    </LiquidButton>
                    <a
                      href={`mailto:info@vendor.com?subject=Clarification:%20Solar%20Quotation%20-%20${encodeURIComponent(finding.title)}&body=${encodeURIComponent(messageText)}`}
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl border border-border hover:bg-bg-main"
                    >
                      <Send className="h-3 w-3" /> Open in Mail App
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
