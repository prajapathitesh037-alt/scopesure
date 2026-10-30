import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { analyzeQuotationDocument } from '@/lib/nebius/client';
import { verifyEvidenceExcerpt } from '@/lib/analysis/evidence';
import { runDeterministicComparison } from '@/lib/analysis/compare';
import { calculateVendorCosts } from '@/lib/analysis/costs';
import { generateFindings } from '@/lib/analysis/findings';
import { compileComprehensiveReport } from '@/lib/reports/generator';
import { extractTextFromPdf } from '@/lib/pdf/extract-text';
import { DEMO_PROJECT, DEMO_VENDORS, DEMO_COMPARISON, DEMO_FINDINGS } from '@/lib/demo-data';
import { getEnv } from '@/lib/env';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const env = getEnv();
    const admin = createAdminClient();

    // 1. Check for Demo Project
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

      return apiSuccess({
        analysisId: `demo-analysis-${Date.now()}`,
        status: 'completed',
        report,
      }, 'Demo project analysis successfully compiled');
    }

    // 2. Fetch Project & Requirements
    const { data: project, error: pErr } = await admin.from('projects').select('*').eq('id', projectId).single();
    if (pErr || !project) {
      return apiError('NOT_FOUND', 'Project not found', 404);
    }

    const { data: rawReqs } = await admin.from('project_requirements').select('*').eq('project_id', projectId);
    const { data: rawQuotes } = await admin.from('quotations').select('*').eq('project_id', projectId);

    const requirements = rawReqs || [];
    const quotations = rawQuotes || [];

    if (quotations.length < 2) {
      return apiError('INSUFFICIENT_QUOTATIONS', 'At least two vendor quotations are required for comparison audit.', 400);
    }

    // 3. Create Analysis Run in 'processing' state
    const { data: analysisRun, error: runErr } = await admin.from('analysis_runs').insert({
      project_id: projectId,
      status: 'processing',
      model_id: env.NEBIUS_MODEL,
      prompt_version: 'v1.0-nemotron',
    }).select().single();

    if (runErr || !analysisRun) {
      return apiError('DATABASE_ERROR', 'Failed to initiate analysis run record', 500);
    }

    const analysisId = analysisRun.id;
    const vendorExtractionResults: Array<{
      id: string;
      name: string;
      currency?: string | null;
      quotedTotal?: number | null;
      lineItems?: any[];
      exclusions?: any[];
      extractedFacts?: any[];
      ambiguities?: any[];
    }> = [];

    // 4. Extract Text & Run NVIDIA Nemotron for each quotation
    for (const quote of quotations) {
      // Fetch or extract page text
      const { data: dbPages } = await admin.from('quotation_pages').select('*').eq('quotation_id', quote.id).order('page_number');
      let pages: any[] = dbPages || [];

      if (pages.length === 0) {
        // Download and extract on-the-fly if not previously extracted
        const { data: blob } = await admin.storage.from('quotation-documents').download(quote.storage_path);
        if (blob) {
          const buffer = await blob.arrayBuffer();
          const extraction = await extractTextFromPdf(buffer);
          if (extraction.pages.length > 0) {
            const toInsert = extraction.pages.map((p) => ({
              quotation_id: quote.id,
              page_number: p.pageNumber,
              extracted_text: p.text,
            }));
            await admin.from('quotation_pages').insert(toInsert);
            pages = toInsert;
          }
        }
      }

      const formattedPages = pages.map((p: any) => ({
        pageNumber: p.page_number,
        text: p.extracted_text,
      }));

      // Call NVIDIA Nemotron via Nebius Token Factory
      const structuredExtraction = await analyzeQuotationDocument({
        vendorName: quote.vendor_name,
        documentName: quote.original_filename,
        pages: formattedPages,
        requirements: (requirements || []).map((r: any) => ({
          field_key: r.field_key,
          label: r.label,
          expected_value: r.expected_value,
          is_required: r.is_required,
        })),
      });

      // Verify supporting evidence excerpts against actual document text
      const verifiedFacts = (structuredExtraction.extracted_facts || []).map((fact) => {
        const verification = verifyEvidenceExcerpt(fact.exact_source_excerpt, fact.source_page, formattedPages);
        return {
          ...fact,
          evidence_verified: verification.isVerified,
          source_page: verification.matchedPageNumber || fact.source_page,
        };
      });

      // Save extracted items to DB
      if (verifiedFacts.length > 0) {
        const itemsToSave = verifiedFacts.map((f) => ({
          analysis_run_id: analysisId,
          quotation_id: quote.id,
          requirement_key: f.requirement_key,
          raw_label: f.original_wording,
          extracted_value: f.extracted_value,
          extracted_status: f.statement_classification,
          source_page: f.source_page,
          source_excerpt: f.exact_source_excerpt,
          evidence_verified: f.evidence_verified,
        }));
        await admin.from('extracted_items').insert(itemsToSave);
      }

      vendorExtractionResults.push({
        id: quote.id,
        name: quote.vendor_name,
        currency: structuredExtraction.currency || 'USD',
        quotedTotal: structuredExtraction.quoted_total,
        lineItems: structuredExtraction.line_items,
        exclusions: structuredExtraction.exclusions,
        extractedFacts: verifiedFacts,
        ambiguities: structuredExtraction.ambiguities,
      });
    }

    // 5. Deterministic Comparison Engine
    const comparisonResults = runDeterministicComparison({
      requirements: requirements.map((r: any) => ({
        field_key: r.field_key,
        label: r.label,
        expected_value: r.expected_value,
        is_required: r.is_required,
      })),
      vendors: vendorExtractionResults as any,
    });

    // 6. Cost Calculation Engine (Integer minor units & reconciliation)
    const costSummary = calculateVendorCosts(vendorExtractionResults as any);

    // 7. Findings Generation
    const findings = generateFindings(comparisonResults, costSummary);

    // Save findings to DB
    if (findings.length > 0) {
      const findingsToInsert = findings.map((f) => ({
        analysis_run_id: analysisId,
        project_id: projectId,
        quotation_id: f.vendorId,
        finding_type: f.findingType,
        severity: f.severity,
        status: 'open',
        title: f.title,
        description: f.description,
        source_excerpt: f.sourceExcerpt,
        source_page: f.sourcePage,
        evidence_verified: f.evidenceVerified,
        recommended_action: f.recommendedAction,
      }));
      await admin.from('findings').insert(findingsToInsert);
    }

    // 8. Compile and Save Comprehensive Report
    const comprehensiveReport = compileComprehensiveReport(
      project,
      comparisonResults,
      costSummary,
      findings
    );

    await admin.from('reports').insert({
      project_id: projectId,
      analysis_run_id: analysisId,
      report_data: comprehensiveReport,
    });

    // 9. Mark Analysis Run Complete
    await admin.from('analysis_runs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', analysisId);

    // Update project status
    await admin.from('projects').update({ status: 'completed' }).eq('id', projectId);

    return apiSuccess({
      analysisId,
      status: 'completed',
      report: comprehensiveReport,
    }, 'Quotation audit and comparison completed successfully.');
  } catch (error: any) {
    console.error('[Analyze Error]', error);
    return apiError('ANALYSIS_FAILED', error?.message || 'An error occurred during quotation analysis', 500);
  }
}
