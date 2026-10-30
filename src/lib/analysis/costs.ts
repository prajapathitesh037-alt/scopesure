export interface CostSummary {
  vendorId: string;
  vendorName: string;
  currency: string;
  quotedTotalMinor: number | null;
  quotedTotalFormatted: string;
  sumOfLineItemsMinor: number | null;
  reconciled: boolean;
  unquotedChargesIdentified: string[];
  reconciliationNotes: string;
}

export interface CostComparisonSummary {
  currency: string;
  isCurrencyUniform: boolean;
  minQuotedMinor: number | null;
  maxQuotedMinor: number | null;
  varianceMinor: number | null;
  vendorSummaries: CostSummary[];
  auditWarnings: string[];
}

/**
 * Converts a dollar/rupee amount to integer minor units (cents / paise).
 */
export function toMinorUnits(amount: number | null | undefined): number | null {
  if (amount === null || amount === undefined || isNaN(amount)) return null;
  return Math.round(amount * 100);
}

/**
 * Formats minor units to human-readable currency string.
 */
export function formatMinorUnits(minor: number | null, currency = 'USD'): string {
  if (minor === null) return 'Not Specified';
  const major = minor / 100;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString()}`;
  }
}

/**
 * Analyzes cost breakdowns, performs deterministic reconciliation,
 * and flags hidden unquoted charges (e.g., permits, freight, panel upgrade).
 */
export function calculateVendorCosts(
  vendors: Array<{
    id: string;
    name: string;
    currency?: string | null;
    quotedTotal?: number | null;
    lineItems?: Array<{ amount?: number | null; original_description: string; currency?: string }>;
    exclusions?: Array<{ item: string }>;
  }>
): CostComparisonSummary {
  const currencies = new Set(vendors.map((v) => (v.currency || 'USD').toUpperCase()));
  const isCurrencyUniform = currencies.size <= 1;
  const primaryCurrency = vendors[0]?.currency?.toUpperCase() || 'USD';

  const vendorSummaries: CostSummary[] = [];
  const validTotals: number[] = [];
  const auditWarnings: string[] = [];

  if (!isCurrencyUniform) {
    auditWarnings.push(`Currency Mismatch: Multiple currencies detected (${Array.from(currencies).join(', ')}). Cross-currency arithmetic halted.`);
  }

  for (const v of vendors) {
    const quotedMinor = toMinorUnits(v.quotedTotal);
    if (quotedMinor !== null && isCurrencyUniform) {
      validTotals.push(quotedMinor);
    }

    const unquotedCharges: string[] = [];
    let lineItemsSumMinor: number | null = null;

    if (v.lineItems && v.lineItems.length > 0) {
      let sum = 0;
      let hasValidItem = false;
      for (const item of v.lineItems) {
        if (item.amount !== null && item.amount !== undefined && !isNaN(item.amount)) {
          sum += toMinorUnits(item.amount) || 0;
          hasValidItem = true;
        } else {
          unquotedCharges.push(`Unstated charge for: "${item.original_description}"`);
        }
      }
      if (hasValidItem) lineItemsSumMinor = sum;
    }

    // Check exclusions for potential surprise costs
    if (v.exclusions) {
      for (const ex of v.exclusions) {
        unquotedCharges.push(`Excluded out-of-pocket item: "${ex.item}"`);
      }
    }

    let reconciled = false;
    let reconciliationNotes = 'Total stated without itemized arithmetic breakdown.';

    if (quotedMinor !== null && lineItemsSumMinor !== null) {
      const diff = Math.abs(quotedMinor - lineItemsSumMinor);
      if (diff === 0) {
        reconciled = true;
        reconciliationNotes = 'Perfect match: Stated total matches sum of all itemized lines.';
      } else {
        reconciled = false;
        reconciliationNotes = `Discrepancy: Stated total differs from line-item sum by ${formatMinorUnits(diff, v.currency || primaryCurrency)}.`;
        auditWarnings.push(`${v.name}: Stated total does not reconcile with itemized line items.`);
      }
    } else if (quotedMinor === null) {
      reconciliationNotes = 'Quoted total is missing or not explicitly stated in document.';
      auditWarnings.push(`${v.name}: Total contract amount is not specified in proposal.`);
    }

    vendorSummaries.push({
      vendorId: v.id,
      vendorName: v.name,
      currency: v.currency || primaryCurrency,
      quotedTotalMinor: quotedMinor,
      quotedTotalFormatted: formatMinorUnits(quotedMinor, v.currency || primaryCurrency),
      sumOfLineItemsMinor: lineItemsSumMinor,
      reconciled,
      unquotedChargesIdentified: unquotedCharges,
      reconciliationNotes,
    });
  }

  const minQuoted = validTotals.length > 0 ? Math.min(...validTotals) : null;
  const maxQuoted = validTotals.length > 0 ? Math.max(...validTotals) : null;
  const variance = minQuoted !== null && maxQuoted !== null ? maxQuoted - minQuoted : null;

  return {
    currency: primaryCurrency,
    isCurrencyUniform,
    minQuotedMinor: minQuoted,
    maxQuotedMinor: maxQuoted,
    varianceMinor: variance,
    vendorSummaries,
    auditWarnings,
  };
}
