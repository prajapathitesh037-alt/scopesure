import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { updateProjectSchema } from '@/lib/schemas/project';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_PROJECT, DEMO_VENDORS } from '@/lib/demo-data';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;

    // Handle demo project
    if (projectId === DEMO_PROJECT.id || projectId === 'demo') {
      return apiSuccess({
        ...DEMO_PROJECT,
        system_capacity_kw: 10.4,
        system_type: DEMO_PROJECT.systemType,
        quotations: DEMO_VENDORS,
      });
    }

    const user = await getAuthenticatedUser();
    const admin = createAdminClient();

    let query = admin.from('projects').select('*, project_requirements(*), quotations(*)').eq('id', projectId);
    if (user) {
      query = query.or(`user_id.eq.${user.id},id.eq.00000000-0000-0000-0000-000000000001`);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return apiError('NOT_FOUND', 'Project not found or access denied', 404);
    }

    return apiSuccess(data);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to retrieve project', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid project update fields', 400, parsed.error.format());
    }

    if (projectId === DEMO_PROJECT.id) {
      return apiSuccess({ ...DEMO_PROJECT, ...parsed.data }, 'Demo project updated in memory');
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('projects')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      return apiError('DATABASE_ERROR', error.message, 400);
    }

    return apiSuccess(data, 'Project updated successfully');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to update project', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;

    if (projectId === DEMO_PROJECT.id) {
      return apiError('FORBIDDEN', 'Cannot delete standard demonstration project', 403);
    }

    const admin = createAdminClient();
    const { error } = await admin.from('projects').delete().eq('id', projectId);

    if (error) {
      return apiError('DATABASE_ERROR', error.message, 400);
    }

    return apiSuccess({ id: projectId }, 'Project deleted successfully');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to delete project', 500);
  }
}
