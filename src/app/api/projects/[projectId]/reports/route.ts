import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_PROJECT, DEMO_VENDORS, DEMO_COMPARISON, DEMO_FINDINGS } from '@/lib/demo-data';
import { compileComprehensiveReport } from '@/lib/reports/generator';
import { calculateVendorCosts } from '@/lib/analysis/costs';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;

    if (projectId === DEMO_PROJECT.id || projectId === 'demo') {
      const costSummary = calculateVendorCosts(
        DEMO_VENDORS.map((v) => ({
          id: v.id,
          name: v.name,
          currency: 'USD',
          quotedTotal: v.quotedPrice,
        }))
      );

      const findings = DEMO_FINDINGS.map((f) => ({
        vendorId: f.vendorId,
        vendorName: f.vendorName,
        findingType: (f.status === 'excluded' ? 'explicit_exclusion' : f.status === 'not-specified' ? 'missing_information' : 'ambiguous_term') as any,
        severity: (f.status === 'excluded' ? 'high' : 'medium') as any,
        title: f.title,
        description: f.description,
        sourceExcerpt: f.evidence,
        sourcePage: f.sourcePage ? parseInt(f.sourcePage, 10) : null,
        evidenceVerified: true,
        recommendedAction: f.recommendedAction,
      }));

      const report = compileComprehensiveReport(
        {
          id: DEMO_PROJECT.id,
          name: DEMO_PROJECT.name,
          location: DEMO_PROJECT.location,
          system_capacity_kw: 10.4,
          system_type: DEMO_PROJECT.systemType,
        },
        DEMO_COMPARISON.map((c) => ({
          requirementKey: c.id,
          requirementLabel: c.item,
          expectedValue: null,
          isRequired: true,
          vendorEvaluations: Object.fromEntries(
            Object.entries(c.vendors).map(([vid, v]) => [
              vid,
              {
                vendorId: vid,
                vendorName: DEMO_VENDORS.find((d) => d.id === vid)?.name || vid,
                status: (v.status === 'not-specified' ? 'not_specified' : v.status) as any,
                detail: v.detail,
                sourceExcerpt: v.evidence || null,
                sourcePage: v.sourcePage ? parseInt(v.sourcePage, 10) : null,
                evidenceVerified: Boolean(v.evidence),
              },
            ])
          ),
        })),
        costSummary,
        findings
      );

      return apiSuccess(report, 'Demo comparison report compiled');
    }

    const admin = createAdminClient();
    const { data: report } = await admin
      .from('reports')
      .select('report_data')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (report?.report_data) {
      return apiSuccess(report.report_data, 'Comparison report retrieved');
    }

    return apiError('NOT_FOUND', 'No generated report found for this project. Please run analysis first.', 404);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to generate report', 500);
  }
}
