import { FindingStatus } from '@/lib/db/schema';
import { ExtractedFact } from '@/lib/schemas/extraction';

export interface VendorComparisonResult {
  requirementKey: string;
  requirementLabel: string;
  expectedValue: string | null;
  isRequired: boolean;
  vendorEvaluations: Record<string, {
    vendorId: string;
    vendorName: string;
    status: FindingStatus;
    detail: string;
    sourceExcerpt: string | null;
    sourcePage: number | null;
    evidenceVerified: boolean;
  }>;
}

export interface CompareInput {
  requirements: Array<{
    field_key: string;
    label: string;
    expected_value: string | null;
    is_required: boolean;
  }>;
  vendors: Array<{
    id: string;
    name: string;
    extractedFacts: ExtractedFact[];
    exclusions: Array<{ item: string; reason?: string | null; supporting_excerpt?: string | null; source_page?: number | null }>;
    ambiguities: Array<{ topic: string; ambiguous_text: string; source_page?: number | null; reason: string }>;
  }>;
}

/**
 * Deterministic comparison engine implementing strict PRD comparison rules:
 * - Never converts 'not_specified' into 'excluded'
 * - Never converts 'unclear' into 'included'
 * - Flags conflicting statements across documents or within single vendor
 */
export function runDeterministicComparison(input: CompareInput): VendorComparisonResult[] {
  const results: VendorComparisonResult[] = [];

  for (const req of input.requirements) {
    const vendorEvaluations: VendorComparisonResult['vendorEvaluations'] = {};

    for (const vendor of input.vendors) {
      // 1. Check for explicit exclusions matching this requirement
      const matchingExclusion = vendor.exclusions.find((ex) =>
        ex.item.toLowerCase().includes(req.field_key.toLowerCase()) ||
        ex.item.toLowerCase().includes(req.label.toLowerCase()) ||
        req.label.toLowerCase().includes(ex.item.toLowerCase())
      );

      if (matchingExclusion) {
        vendorEvaluations[vendor.id] = {
          vendorId: vendor.id,
          vendorName: vendor.name,
          status: 'excluded',
          detail: `Explicitly excluded: ${matchingExclusion.reason || matchingExclusion.item}`,
          sourceExcerpt: matchingExclusion.supporting_excerpt || null,
          sourcePage: matchingExclusion.source_page || null,
          evidenceVerified: Boolean(matchingExclusion.supporting_excerpt),
        };
        continue;
      }

      // 2. Check for ambiguities
      const matchingAmbiguity = vendor.ambiguities.find((amb) =>
        amb.topic.toLowerCase().includes(req.field_key.toLowerCase()) ||
        amb.topic.toLowerCase().includes(req.label.toLowerCase())
      );

      if (matchingAmbiguity) {
        vendorEvaluations[vendor.id] = {
          vendorId: vendor.id,
          vendorName: vendor.name,
          status: 'unclear',
          detail: `Ambiguous wording: ${matchingAmbiguity.reason}`,
          sourceExcerpt: matchingAmbiguity.ambiguous_text,
          sourcePage: matchingAmbiguity.source_page || null,
          evidenceVerified: Boolean(matchingAmbiguity.ambiguous_text),
        };
        continue;
      }

      // 3. Check extracted facts
      const matchingFacts = vendor.extractedFacts.filter((f) =>
        f.requirement_key === req.field_key ||
        f.requirement_key.toLowerCase().includes(req.field_key.toLowerCase()) ||
        f.original_wording.toLowerCase().includes(req.label.toLowerCase())
      );

      if (matchingFacts.length === 0) {
        // Not mentioned anywhere in proposal
        vendorEvaluations[vendor.id] = {
          vendorId: vendor.id,
          vendorName: vendor.name,
          status: 'not_specified',
          detail: `Not specified in ${vendor.name}'s proposal.`,
          sourceExcerpt: null,
          sourcePage: null,
          evidenceVerified: false,
        };
      } else if (matchingFacts.length > 1) {
        // Multiple facts: check if they contradict each other
        const statuses = new Set(matchingFacts.map((f) => f.statement_classification));
        if (statuses.size > 1 && (statuses.has('included') && statuses.has('excluded'))) {
          vendorEvaluations[vendor.id] = {
            vendorId: vendor.id,
            vendorName: vendor.name,
            status: 'conflicting',
            detail: `Conflicting statements found in document for ${req.label}.`,
            sourceExcerpt: matchingFacts.map((f) => f.exact_source_excerpt).filter(Boolean).join(' vs '),
            sourcePage: matchingFacts[0].source_page || null,
            evidenceVerified: true,
          };
        } else {
          const primary = matchingFacts[0];
          vendorEvaluations[vendor.id] = {
            vendorId: vendor.id,
            vendorName: vendor.name,
            status: primary.statement_classification,
            detail: primary.extracted_value || primary.original_wording,
            sourceExcerpt: primary.exact_source_excerpt || null,
            sourcePage: primary.source_page || null,
            evidenceVerified: Boolean(primary.exact_source_excerpt),
          };
        }
      } else {
        const primary = matchingFacts[0];
        vendorEvaluations[vendor.id] = {
          vendorId: vendor.id,
          vendorName: vendor.name,
          status: primary.statement_classification,
          detail: primary.extracted_value || primary.original_wording,
          sourceExcerpt: primary.exact_source_excerpt || null,
          sourcePage: primary.source_page || null,
          evidenceVerified: Boolean(primary.exact_source_excerpt),
        };
      }
    }

    results.push({
      requirementKey: req.field_key,
      requirementLabel: req.label,
      expectedValue: req.expected_value,
      isRequired: req.is_required,
      vendorEvaluations,
    });
  }

  return results;
}
