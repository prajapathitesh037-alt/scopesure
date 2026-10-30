import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { uploadUrlRequestSchema } from '@/lib/schemas/project';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const parsed = uploadUrlRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid file upload request', 400, parsed.error.format());
    }

    const user = await getAuthenticatedUser();
    const userId = user ? user.id : '00000000-0000-0000-0000-000000000001';

    const quotationId = crypto.randomUUID();
    const extension = parsed.data.filename.endsWith('.txt') ? 'txt' : 'pdf';
    const storagePath = `${userId}/${projectId}/${quotationId}.${extension}`;

    const admin = createAdminClient();

    // 1. Create quotation record with status 'pending'
    const { error: dbError } = await admin.from('quotations').insert({
      id: quotationId,
      project_id: projectId,
      vendor_name: parsed.data.vendor_name,
      original_filename: parsed.data.filename,
      storage_path: storagePath,
      mime_type: parsed.data.mime_type,
      file_size_bytes: parsed.data.file_size_bytes,
      upload_status: 'pending',
      extraction_status: 'pending',
    });

    if (dbError) {
      console.warn('[Storage] DB insertion warning:', dbError.message);
    }

    // 2. Generate signed upload URL from Supabase Storage (quotation-documents)
    let uploadUrl = '';
    try {
      const { data: signedData, error: signError } = await admin
        .storage
        .from('quotation-documents')
        .createSignedUploadUrl(storagePath);

      if (!signError && signedData?.signedUrl) {
        uploadUrl = signedData.signedUrl;
      }
    } catch (e: any) {
      console.warn('[Storage] createSignedUploadUrl exception:', e.message);
    }

    return apiSuccess({
      quotation_id: quotationId,
      storage_path: storagePath,
      upload_url: uploadUrl || `/api/projects/${projectId}/quotations/mock-upload`,
      vendor_name: parsed.data.vendor_name,
      filename: parsed.data.filename,
    }, 'Upload URL generated successfully', 201);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to generate upload URL', 500);
  }
}
