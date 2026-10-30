import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_PROJECT, DEMO_VENDORS, DEMO_COMPARISON, DEMO_FINDINGS } from '@/lib/demo-data';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;

    if (projectId === DEMO_PROJECT.id || projectId === 'demo') {
      return apiSuccess({
        project: DEMO_PROJECT,
        vendors: DEMO_VENDORS,
        comparison: DEMO_COMPARISON,
        findings: DEMO_FINDINGS,
        is_demo: true,
      });
    }

    const admin = createAdminClient();

    // Fetch latest completed report for this project
    const { data: report } = await admin
      .from('reports')
      .select('report_data')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (report?.report_data) {
      return apiSuccess(report.report_data);
    }

    // Fallback: return raw project with quotations and requirements
    const { data: project } = await admin
      .from('projects')
      .select('*, project_requirements(*), quotations(*)')
      .eq('id', projectId)
      .single();

    if (!project) {
      return apiError('NOT_FOUND', 'Project not found', 404);
    }

    return apiSuccess({
      project,
      comparison: [],
      findings: [],
      status: project.status,
    });
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to retrieve comparison', 500);
  }
}
