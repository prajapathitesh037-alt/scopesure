import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { uploadCompleteSchema } from '@/lib/schemas/project';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractTextFromPdf } from '@/lib/pdf/extract-text';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const parsed = uploadCompleteSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid payload', 400, parsed.error.format());
    }

    const admin = createAdminClient();
    const { quotation_id, storage_path } = parsed.data;

    // 1. Mark upload as completed
    await admin
      .from('quotations')
      .update({ upload_status: 'uploaded' })
      .eq('id', quotation_id);

    // 2. Download file from private storage to run text extraction
    let extractionStatus: 'extracted' | 'needs_ocr' | 'failed' = 'extracted';
    let pagesCount = 0;

    try {
      const { data: fileBlob, error: downloadError } = await admin
        .storage
        .from('quotation-documents')
        .download(storage_path);

      if (!downloadError && fileBlob) {
        const arrayBuffer = await fileBlob.arrayBuffer();

        if (storage_path.endsWith('.txt')) {
          const text = new TextDecoder().decode(arrayBuffer);
          await admin.from('quotation_pages').insert({
            quotation_id,
            page_number: 1,
            extracted_text: text,
          });
          pagesCount = 1;
        } else {
          // PDF text extraction
          const extraction = await extractTextFromPdf(arrayBuffer);
          extractionStatus = extraction.status;
          pagesCount = extraction.totalPages;

          if (extraction.success && extraction.pages.length > 0) {
            const pagesToInsert = extraction.pages.map((p) => ({
              quotation_id,
              page_number: p.pageNumber,
              extracted_text: p.text,
            }));
            await admin.from('quotation_pages').insert(pagesToInsert);
          }
        }
      }
    } catch (extractErr: any) {
      console.warn('[Extraction Warning]', extractErr.message);
    }

    // 3. Update extraction status in DB
    await admin
      .from('quotations')
      .update({ extraction_status: extractionStatus })
      .eq('id', quotation_id);

    return apiSuccess({
      quotation_id,
      project_id: projectId,
      upload_status: 'uploaded',
      extraction_status: extractionStatus,
      pages_extracted: pagesCount,
    }, 'Quotation registered and text extraction completed.');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to complete quotation upload', 500);
  }
}
