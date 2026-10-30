import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ quotationId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { quotationId } = await params;
    const admin = createAdminClient();

    // 1. Get quotation details to identify storage path
    const { data: quote } = await admin
      .from('quotations')
      .select('storage_path')
      .eq('id', quotationId)
      .single();

    if (quote?.storage_path) {
      await admin.storage.from('quotation-documents').remove([quote.storage_path]);
    }

    // 2. Delete database record (cascades to quotation_pages and extracted_items)
    const { error } = await admin.from('quotations').delete().eq('id', quotationId);

    if (error) {
      return apiError('DATABASE_ERROR', error.message, 400);
    }

    return apiSuccess({ id: quotationId }, 'Quotation and associated files deleted successfully');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to delete quotation', 500);
  }
}
