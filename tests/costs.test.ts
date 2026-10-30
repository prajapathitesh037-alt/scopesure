import { describe, it, expect } from 'vitest';
import { calculateVendorCosts, toMinorUnits, formatMinorUnits } from '@/lib/analysis/costs';

describe('Cost Calculation Engine', () => {
  it('converts major currencies to integer minor units (cents / paise)', () => {
    expect(toMinorUnits(28500)).toBe(2850000);
    expect(toMinorUnits(25200.50)).toBe(2520050);
    expect(toMinorUnits(null)).toBeNull();
    expect(toMinorUnits(undefined)).toBeNull();
  });

  it('formats minor units accurately without rounding drift', () => {
    expect(formatMinorUnits(2850000, 'USD')).toBe('$28,500');
    expect(formatMinorUnits(null)).toBe('Not Specified');
  });

  it('reconciles when stated total matches itemized line-item sum', () => {
    const vendors = [
      {
        id: 'v1',
        name: 'SunPower',
        currency: 'USD',
        quotedTotal: 28500,
        lineItems: [
          { amount: 18500, original_description: 'Equipment' },
          { amount: 8000, original_description: 'Labor' },
          { amount: 2000, original_description: 'Permits' },
        ],
      },
    ];

    const result = calculateVendorCosts(vendors);
    expect(result.vendorSummaries[0].reconciled).toBe(true);
    expect(result.vendorSummaries[0].quotedTotalMinor).toBe(2850000);
    expect(result.vendorSummaries[0].sumOfLineItemsMinor).toBe(2850000);
  });

  it('flags reconciliation mismatch when stated total differs from line items', () => {
    const vendors = [
      {
        id: 'v2',
        name: 'Discrepant Solar',
        currency: 'USD',
        quotedTotal: 30000,
        lineItems: [
          { amount: 20000, original_description: 'Equipment' },
          { amount: 8000, original_description: 'Labor' },
          // Sum is 28,000, but stated is 30,000 ($2,000 unexplained gap)
        ],
      },
    ];

    const result = calculateVendorCosts(vendors);
    expect(result.vendorSummaries[0].reconciled).toBe(false);
    expect(result.vendorSummaries[0].reconciliationNotes).toContain('Discrepancy');
    expect(result.auditWarnings.length).toBeGreaterThan(0);
  });

  it('never treats unknown cost as zero', () => {
    const vendors = [
      {
        id: 'v3',
        name: 'Incomplete Solar',
        currency: 'USD',
        quotedTotal: null, // Total is missing
        lineItems: [{ amount: null, original_description: 'Unpriced Freight' }],
      },
    ];

    const result = calculateVendorCosts(vendors);
    expect(result.vendorSummaries[0].quotedTotalMinor).toBeNull();
    expect(result.minQuotedMinor).toBeNull();
    expect(result.vendorSummaries[0].unquotedChargesIdentified[0]).toContain('Unpriced Freight');
  });

  it('detects and halts arithmetic on currency mismatch', () => {
    const vendors = [
      { id: 'v1', name: 'US Solar', currency: 'USD', quotedTotal: 25000 },
      { id: 'v2', name: 'India Solar', currency: 'INR', quotedTotal: 2500000 },
    ];

    const result = calculateVendorCosts(vendors);
    expect(result.isCurrencyUniform).toBe(false);
    expect(result.auditWarnings.some((w) => w.includes('Currency Mismatch'))).toBe(true);
  });
});
