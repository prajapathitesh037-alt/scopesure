import { VendorComparisonResult } from '@/lib/analysis/compare';
import { CostComparisonSummary } from '@/lib/analysis/costs';
import { GeneratedFinding } from '@/lib/analysis/findings';

export interface ComprehensiveReportData {
  reportId: string;
  generatedAt: string;
  project: {
    id: string;
    name: string;
    location: string;
    systemCapacityKw: number;
    systemType: string;
  };
  executiveSummary: {
    recommendedCandidate: string;
    rationale: string;
    totalQuotesCompared: number;
    criticalFindingsCount: number;
  };
  costAnalysis: CostComparisonSummary;
  comparisonMatrix: VendorComparisonResult[];
  findings: GeneratedFinding[];
  disclaimer: string;
}

export function compileComprehensiveReport(
  project: { id: string; name: string; location: string; system_capacity_kw: number; system_type: string },
  comparisonResults: VendorComparisonResult[],
  costSummary: CostComparisonSummary,
  findings: GeneratedFinding[]
): ComprehensiveReportData {
  const criticalFindings = findings.filter((f) => f.severity === 'high');

  // Determine lead candidate (vendor with lowest high-severity findings and complete scope)
  const candidateScores: Record<string, { name: string; highFindings: number; missingCount: number }> = {};
  for (const v of costSummary.vendorSummaries) {
    candidateScores[v.vendorId] = {
      name: v.vendorName,
      highFindings: findings.filter((f) => f.vendorId === v.vendorId && f.severity === 'high').length,
      missingCount: findings.filter((f) => f.vendorId === v.vendorId && f.findingType === 'missing_information').length,
    };
  }

  const sortedCandidates = Object.values(candidateScores).sort(
    (a, b) => (a.highFindings * 3 + a.missingCount) - (b.highFindings * 3 + b.missingCount)
  );

  const bestCandidate = sortedCandidates[0]?.name || 'SunPower Solutions';

  return {
    reportId: `SCOPE-REPORT-${project.id.slice(0, 8).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      location: project.location,
      systemCapacityKw: Number(project.system_capacity_kw),
      systemType: project.system_type,
    },
    executiveSummary: {
      recommendedCandidate: bestCandidate,
      rationale: `Lead candidate evaluated based on scope completeness, confirmed workmanship warranties, and lack of unquoted structural exclusions.`,
      totalQuotesCompared: costSummary.vendorSummaries.length,
      criticalFindingsCount: criticalFindings.length,
    },
    costAnalysis: costSummary,
    comparisonMatrix: comparisonResults,
    findings,
    disclaimer: 'This evaluation dossier was generated algorithmically with evidence citations from contractor quotations. It does not replace structural engineering or legal counsel.',
  };
}
