'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { LiquidButton } from '@/components/liquid/liquid-button';
import { LiquidProgress } from '@/components/liquid/liquid-progress';
import { DEMO_VENDORS } from '@/lib/demo-data';
import { Upload, FileText, CheckCircle2, AlertTriangle, Play, Plus, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Vendor } from '@/lib/types';

export default function QuotationsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(DEMO_VENDORS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setStatusMessage('Preparing quotation documents...');

    const steps = [
      { p: 20, msg: 'Extracting line items and equipment models...' },
      { p: 45, msg: 'Comparing terms against 10.4 kW baseline requirements...' },
      { p: 70, msg: 'Checking source evidence citations and page offsets...' },
      { p: 90, msg: 'Synthesizing conflicting clauses and unquoted exclusions...' },
      { p: 100, msg: 'Audit complete! Transferring to Scope Matrix...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusMessage(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          router.push('/dashboard/comparison');
        }, 800);
      }
    }, 700);
  };

  const handleAddQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName) return;
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      name: uploadName,
      quotedPrice: uploadPrice ? parseFloat(uploadPrice) : 29000,
      documentName: `${uploadName.replace(/\s+/g, '_')}_Proposal.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      analysisStatus: 'complete',
      findingsCount: 3,
      missingInfoCount: 1,
      color: '#397553',
    };
    setVendors([...vendors, newVendor]);
    setUploadName('');
    setUploadPrice('');
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Quotation Management"
        breadcrumbs={[
          { label: 'SCOPEsure', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Quotations' },
        ]}
      />

      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Installer Quotations</h1>
            <p className="text-xs text-text-secondary">
              Upload proposals from 2 to 4 installers for automated scope auditing
            </p>
          </div>
          <LiquidButton
            variant="primary"
            size="md"
            icon={<Play className="h-4 w-4" />}
            onClick={triggerAnalysis}
            disabled={isAnalyzing}
            className="bg-forest text-white"
          >
            {isAnalyzing ? 'Auditing in Progress...' : 'Run Full Scope Audit'}
          </LiquidButton>
        </div>

        {/* Progress Overlay when running */}
        {isAnalyzing && (
          <div className="rounded-2xl border border-forest/30 bg-pale-green/60 p-8 flex flex-col items-center justify-center">
            <LiquidProgress progress={progress} status={statusMessage} />
          </div>
        )}

        {/* Upload Dropzone & Manual Input */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drag & Drop Card */}
          <div className="lg:col-span-2 rounded-2xl border-2 border-dashed border-border hover:border-forest/50 bg-white p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pale-green text-forest mb-4 group-hover:scale-105 transition-transform">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">
              Drop installer quotation PDFs here
            </h3>
            <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
              Accepts PDF, scanned proposals, or equipment specifications up to 50MB each.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] text-text-secondary bg-bg-main px-3 py-1 rounded-full border border-border">
                OCR Auto-Extraction Enabled
              </span>
            </div>
          </div>

          {/* Quick Manual Add */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-1">Add Vendor Manually</h3>
              <p className="text-xs text-text-secondary mb-4">Register an installer proposal directly.</p>

              <form onSubmit={handleAddQuotation} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text-primary block mb-1">Installer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Momentum Solar"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text-primary block mb-1">Total Quoted Price ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 27500"
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <LiquidButton variant="primary" size="sm" className="w-full mt-2 bg-forest text-white">
                  Add to Comparison
                </LiquidButton>
              </form>
            </div>
          </div>
        </div>

        {/* Existing Uploaded Quotations Table */}
        <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-bg-main/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Active Quotations ({vendors.length})</h3>
            <span className="text-xs text-forest font-semibold">Ready for Comparison</span>
          </div>

          <div className="divide-y divide-border">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sage/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                    style={{ backgroundColor: `${vendor.color}20` }}
                  >
                    <FileText className="h-6 w-6" style={{ color: vendor.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{vendor.name}</h4>
                    <p className="text-xs text-text-secondary">{vendor.documentName} • Uploaded {vendor.uploadDate}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px]">
                      <span className="text-forest font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {vendor.findingsCount} findings audited
                      </span>
                      {vendor.missingInfoCount > 0 && (
                        <span className="text-warning font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {vendor.missingInfoCount} missing specs
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-bold text-text-primary tabular-nums block">
                      ${vendor.quotedPrice?.toLocaleString() ?? 'N/A'}
                    </span>
                    <span className="text-[11px] text-text-secondary">Turnkey Contract</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <LiquidButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/dashboard/comparison')}
                    >
                      <Eye className="h-4 w-4" />
                    </LiquidButton>
                    <button
                      onClick={() => setVendors(vendors.filter((v) => v.id !== vendor.id))}
                      className="p-2 text-text-secondary hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                      aria-label="Remove quotation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
