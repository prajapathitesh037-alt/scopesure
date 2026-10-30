import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ analysisId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { analysisId } = await params;

    if (analysisId.startsWith('demo-')) {
      return apiSuccess({
        id: analysisId,
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });
    }

    const admin = createAdminClient();
    const { data: run, error } = await admin
      .from('analysis_runs')
      .select('*, findings(*), reports(*)')
      .eq('id', analysisId)
      .single();

    if (error || !run) {
      return apiError('NOT_FOUND', 'Analysis run not found', 404);
    }

    return apiSuccess(run);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to retrieve analysis run', 500);
  }
}
