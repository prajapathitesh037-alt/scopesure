import { FindingType, FindingSeverity, FindingStatus } from '@/lib/db/schema';
import { VendorComparisonResult } from './compare';
import { CostComparisonSummary } from './costs';

export interface GeneratedFinding {
  vendorId: string | null;
  vendorName: string;
  findingType: FindingType;
  severity: FindingSeverity;
  title: string;
  description: string;
  sourceExcerpt: string | null;
  sourcePage: number | null;
  evidenceVerified: boolean;
  recommendedAction: string;
}

/**
 * Synthesizes comparison results, cost calculations, and exclusions
 * into actionable procurement audit findings.
 */
export function generateFindings(
  comparisonResults: VendorComparisonResult[],
  costSummary: CostComparisonSummary
): GeneratedFinding[] {
  const findings: GeneratedFinding[] = [];

  // 1. Process comparison results for missing specs, exclusions, and conflicts
  for (const row of comparisonResults) {
    for (const [vendorId, evalItem] of Object.entries(row.vendorEvaluations)) {
      if (evalItem.status === 'excluded') {
        findings.push({
          vendorId,
          vendorName: evalItem.vendorName,
          findingType: 'explicit_exclusion',
          severity: row.isRequired ? 'high' : 'medium',
          title: `${evalItem.vendorName}: ${row.requirementLabel} Explicitly Excluded`,
          description: `${evalItem.vendorName}'s proposal explicitly states that ${row.requirementLabel.toLowerCase()} is not covered. ${evalItem.detail}`,
          sourceExcerpt: evalItem.sourceExcerpt,
          sourcePage: evalItem.sourcePage,
          evidenceVerified: evalItem.evidenceVerified,
          recommendedAction: `Ask ${evalItem.vendorName} whether they can include ${row.requirementLabel} and request a binding quote for this surcharge.`,
        });
      } else if (evalItem.status === 'not_specified') {
        findings.push({
          vendorId,
          vendorName: evalItem.vendorName,
          findingType: 'missing_information',
          severity: row.isRequired ? 'high' : 'low',
          title: `${evalItem.vendorName}: ${row.requirementLabel} Not Specified`,
          description: `No details, equipment brand, or confirmation was found in ${evalItem.vendorName}'s document for ${row.requirementLabel}.`,
          sourceExcerpt: null,
          sourcePage: null,
          evidenceVerified: false,
          recommendedAction: `Request written confirmation from ${evalItem.vendorName} specifying the exact equipment and scope for ${row.requirementLabel}.`,
        });
      } else if (evalItem.status === 'unclear') {
        findings.push({
          vendorId,
          vendorName: evalItem.vendorName,
          findingType: 'ambiguous_term',
          severity: 'medium',
          title: `${evalItem.vendorName}: Ambiguous Terms on ${row.requirementLabel}`,
          description: `The wording in the proposal regarding ${row.requirementLabel.toLowerCase()} is unclear: "${evalItem.detail}".`,
          sourceExcerpt: evalItem.sourceExcerpt,
          sourcePage: evalItem.sourcePage,
          evidenceVerified: evalItem.evidenceVerified,
          recommendedAction: `Clarify with ${evalItem.vendorName} whether this clause covers full installation and warranty without extra labor charges.`,
        });
      } else if (evalItem.status === 'conflicting') {
        findings.push({
          vendorId,
          vendorName: evalItem.vendorName,
          findingType: 'conflicting_terms',
          severity: 'high',
          title: `${evalItem.vendorName}: Contradictory Clauses for ${row.requirementLabel}`,
          description: `Conflicting statements exist within ${evalItem.vendorName}'s quotation regarding ${row.requirementLabel.toLowerCase()}.`,
          sourceExcerpt: evalItem.sourceExcerpt,
          sourcePage: evalItem.sourcePage,
          evidenceVerified: evalItem.evidenceVerified,
          recommendedAction: `Demand an addendum from ${evalItem.vendorName} reconciling the contradictory language before signing any agreement.`,
        });
      }
    }
  }

  // 2. Process Cost Issues & Discrepancies
  for (const vCost of costSummary.vendorSummaries) {
    if (!vCost.reconciled && vCost.sumOfLineItemsMinor !== null) {
      findings.push({
        vendorId: vCost.vendorId,
        vendorName: vCost.vendorName,
        findingType: 'cost_issue',
        severity: 'high',
        title: `${vCost.vendorName}: Contract Sum Reconciliation Mismatch`,
        description: vCost.reconciliationNotes,
        sourceExcerpt: null,
        sourcePage: null,
        evidenceVerified: false,
        recommendedAction: `Request an itemized billing sheet from ${vCost.vendorName} showing how the quoted total was derived.`,
      });
    }

    if (vCost.unquotedChargesIdentified.length > 0) {
      for (const unquoted of vCost.unquotedChargesIdentified) {
        findings.push({
          vendorId: vCost.vendorId,
          vendorName: vCost.vendorName,
          findingType: 'cost_issue',
          severity: 'medium',
          title: `${vCost.vendorName}: Potential Unbilled Out-of-Pocket Expense`,
          description: unquoted,
          sourceExcerpt: null,
          sourcePage: null,
          evidenceVerified: false,
          recommendedAction: `Obtain a firm, not-to-exceed ceiling quote from ${vCost.vendorName} for this item.`,
        });
      }
    }
  }

  return findings;
}
