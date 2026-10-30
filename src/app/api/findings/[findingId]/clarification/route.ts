import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateClarificationDraft } from '@/lib/analysis/clarifications';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { DEMO_FINDINGS } from '@/lib/demo-data';

interface RouteParams {
  params: Promise<{ findingId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { findingId } = await params;
    const user = await getAuthenticatedUser();
    const admin = createAdminClient();

    let findingTitle = '';
    let findingDescription = '';
    let recommendedAction = '';
    let vendorName = 'Solar Installer';
    let sourceDoc: string | null = null;
    let sourcePage: number | null = null;

    // Check demo findings first
    const demoFinding = DEMO_FINDINGS.find((f) => f.id === findingId);
    if (demoFinding) {
      findingTitle = demoFinding.title;
      findingDescription = demoFinding.description;
      recommendedAction = demoFinding.recommendedAction;
      vendorName = demoFinding.vendorName;
      sourceDoc = demoFinding.sourceDoc;
      sourcePage = demoFinding.sourcePage ? parseInt(demoFinding.sourcePage, 10) : null;
    } else {
      const { data: dbFinding } = await admin
        .from('findings')
        .select('*, quotations(vendor_name, original_filename)')
        .eq('id', findingId)
        .single();

      if (!dbFinding) {
        return apiError('NOT_FOUND', 'Finding record not found', 404);
      }

      findingTitle = dbFinding.title;
      findingDescription = dbFinding.description;
      recommendedAction = dbFinding.recommended_action;
      vendorName = dbFinding.quotations?.vendor_name || 'Installer';
      sourceDoc = dbFinding.quotations?.original_filename || null;
      sourcePage = dbFinding.source_page;
    }

    // Call NVIDIA Nemotron clarification generator
    const draft = await generateClarificationDraft({
      vendorName,
      findingTitle,
      findingDescription,
      recommendedAction,
      sourceDoc,
      sourcePage,
    });

    // Save draft in DB if finding exists in database
    if (!demoFinding) {
      await admin.from('clarification_drafts').insert({
        finding_id: findingId,
        user_id: user?.id || null,
        subject: draft.subject,
        message_body: draft.messageBody,
        status: 'draft',
      });
    }

    return apiSuccess(draft, 'Clarification draft generated successfully');
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to generate clarification draft', 500);
  }
}
