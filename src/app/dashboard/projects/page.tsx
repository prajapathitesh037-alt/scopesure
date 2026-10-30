'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { LiquidButton } from '@/components/liquid/liquid-button';
import { LiquidCard } from '@/components/liquid/liquid-card';
import { DEMO_PROJECT } from '@/lib/demo-data';
import { Plus, MapPin, Zap, Battery, Calendar, ShieldCheck, CheckCircle2, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([DEMO_PROJECT]);
  const [newProject, setNewProject] = useState({
    name: 'North Austin Residence PV',
    location: 'Austin, TX',
    systemCapacity: '10.4 kW',
    systemType: 'Grid-Tied with Enphase Battery',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      location: newProject.location,
      systemCapacity: newProject.systemCapacity,
      systemType: newProject.systemType,
      status: 'pending' as const,
      quotationCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects([created, ...projects]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Solar Procurement Projects"
        breadcrumbs={[
          { label: 'SCOPEsure', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects' },
        ]}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Solar Projects</h1>
            <p className="text-xs text-text-secondary">
              Manage your residential or commercial solar procurement specifications
            </p>
          </div>
          <LiquidButton
            variant="primary"
            size="md"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowModal(true)}
            className="bg-forest text-white"
          >
            New Solar Project
          </LiquidButton>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <LiquidCard
              key={proj.id}
              className="p-6 flex flex-col justify-between hover:border-forest/40 transition-all cursor-pointer group"
              onClick={() => router.push('/dashboard/comparison')}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-forest uppercase tracking-wider bg-pale-green px-2.5 py-0.5 rounded-full">
                    {proj.status === 'complete' ? 'Audited' : 'Draft'}
                  </span>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {proj.createdAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary group-hover:text-forest transition-colors">
                  {proj.name}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-forest" />
                    <span>{proj.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-forest" />
                    <span>Target Capacity: {proj.systemCapacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-3.5 w-3.5 text-forest" />
                    <span>{proj.systemType}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">
                  {proj.quotationCount} Proposals Linked
                </span>
                <span className="text-xs text-forest font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Audit <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </LiquidCard>
          ))}
        </div>

        {/* Requirements Specification Guide */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-forest" />
            Standard Baseline Requirements Template
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Every vendor quotation uploaded will be benchmarked against these critical baseline procurement standards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-bg-main p-3.5 border border-border">
              <span className="font-bold text-text-primary block mb-1">Module Efficiency</span>
              <span className="text-text-secondary">Min 21.0% Monocrystalline Tier 1 with degradation &lt; 0.5%/yr</span>
            </div>
            <div className="rounded-xl bg-bg-main p-3.5 border border-border">
              <span className="font-bold text-text-primary block mb-1">Inverter System</span>
              <span className="text-text-secondary">Module-level rapid shutdown (MLPE) & battery integration</span>
            </div>
            <div className="rounded-xl bg-bg-main p-3.5 border border-border">
              <span className="font-bold text-text-primary block mb-1">Structural Racking</span>
              <span className="text-text-secondary">PE-stamped engineering calculations for 120 mph wind rating</span>
            </div>
            <div className="rounded-xl bg-bg-main p-3.5 border border-border">
              <span className="font-bold text-text-primary block mb-1">Warranty Guarantee</span>
              <span className="text-text-secondary">25-year panel production & 10+ year contractor workmanship</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-border p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Create Solar Procurement Project</h3>
            <p className="text-xs text-text-secondary">Specify project location and target equipment sizing.</p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-text-primary block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="font-semibold text-text-primary block mb-1">Location / Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={newProject.location}
                  onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-text-primary block mb-1">System Capacity</label>
                  <input
                    type="text"
                    required
                    value={newProject.systemCapacity}
                    onChange={(e) => setNewProject({ ...newProject, systemCapacity: e.target.value })}
                    className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="font-semibold text-text-primary block mb-1">System Type</label>
                  <input
                    type="text"
                    required
                    value={newProject.systemType}
                    onChange={(e) => setNewProject({ ...newProject, systemType: e.target.value })}
                    className="w-full rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <LiquidButton variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </LiquidButton>
                <LiquidButton variant="primary" size="sm" className="bg-forest text-white">
                  Save Project
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
