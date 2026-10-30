import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_FINDINGS } from '@/lib/demo-data';

interface RouteParams {
  params: Promise<{ findingId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { findingId } = await params;

    const demoFinding = DEMO_FINDINGS.find((f) => f.id === findingId);
    if (demoFinding) {
      return apiSuccess(demoFinding);
    }

    const admin = createAdminClient();
    const { data: finding, error } = await admin
      .from('findings')
      .select('*, quotations(vendor_name, original_filename)')
      .eq('id', findingId)
      .single();

    if (error || !finding) {
      return apiError('NOT_FOUND', 'Finding not found', 404);
    }

    return apiSuccess(finding);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to retrieve finding', 500);
  }
}
