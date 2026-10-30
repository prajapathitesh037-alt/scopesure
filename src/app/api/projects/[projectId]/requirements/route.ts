import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { updateRequirementsSchema } from '@/lib/schemas/project';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_PROJECT } from '@/lib/demo-data';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const parsed = updateRequirementsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid requirements configuration', 400, parsed.error.format());
    }

    if (projectId === DEMO_PROJECT.id) {
      return apiSuccess(parsed.data.requirements, 'Demo project requirements updated');
    }

    const admin = createAdminClient();

    // Delete existing requirements and re-insert new configuration
    await admin.from('project_requirements').delete().eq('project_id', projectId);

    const toInsert = parsed.data.requirements.map((r) => ({
      project_id: projectId,
      field_key: r.field_key,
      label: r.label,
      expected_value: r.expected_value || null,
      is_required: r.is_required,
      notes: r.notes || null,
    }));

    const { data, error } = await admin.from('project_requirements').insert(toInsert).select();

    if (error) {
      return apiError('DATABASE_ERROR', error.message, 400);
    }

    return apiSuccess(data, 'Project requirements updated successfully');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to update requirements', 500);
  }
}
