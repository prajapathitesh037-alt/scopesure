import { describe, it, expect } from 'vitest';
import { runDeterministicComparison } from '@/lib/analysis/compare';

describe('Deterministic Vendor Comparison Engine', () => {
  const sampleRequirements = [
    { field_key: 'solar_panels', label: 'Solar Panels', expected_value: '400W Monocrystalline', is_required: true },
    { field_key: 'inverter', label: 'Inverter System', expected_value: 'Enphase Microinverters', is_required: true },
    { field_key: 'panel_upgrade', label: 'Electrical Panel Upgrade', expected_value: '200A Main Panel', is_required: true },
    { field_key: 'freight_delivery', label: 'Freight & Delivery', expected_value: 'Included', is_required: false },
    { field_key: 'workmanship_warranty', label: 'Workmanship Warranty', expected_value: '25 Years', is_required: true },
  ];

  it('correctly maps explicitly included items with verified evidence', () => {
    const vendors = [
      {
        id: 'vendor-a',
        name: 'SunPower Solutions',
        extractedFacts: [
          {
            requirement_key: 'solar_panels',
            original_wording: '26x REC Alpha Pure-R 400W',
            extracted_value: '26x REC 400W',
            statement_classification: 'included' as const,
            exact_source_excerpt: 'Page 2: 26x REC Alpha Pure-R Series 400W monocrystalline panels',
            source_page: 2,
          },
        ],
        exclusions: [],
        ambiguities: [],
      },
    ];

    const result = runDeterministicComparison({ requirements: sampleRequirements, vendors });
    const panelEval = result.find((r) => r.requirementKey === 'solar_panels')?.vendorEvaluations['vendor-a'];

    expect(panelEval?.status).toBe('included');
    expect(panelEval?.evidenceVerified).toBe(true);
    expect(panelEval?.sourcePage).toBe(2);
  });

  it('CRITICAL RULE: Never converts missing information into an exclusion', () => {
    const vendors = [
      {
        id: 'vendor-b',
        name: 'GreenRay Energy',
        extractedFacts: [], // Document makes zero mention of freight or panel upgrade
        exclusions: [],
        ambiguities: [],
      },
    ];

    const result = runDeterministicComparison({ requirements: sampleRequirements, vendors });
    const freightEval = result.find((r) => r.requirementKey === 'freight_delivery')?.vendorEvaluations['vendor-b'];

    expect(freightEval?.status).toBe('not_specified');
    expect(freightEval?.status).not.toBe('excluded');
    expect(freightEval?.evidenceVerified).toBe(false);
  });

  it('correctly identifies explicit exclusions with reason', () => {
    const vendors = [
      {
        id: 'vendor-c',
        name: 'Apex Solar Co.',
        extractedFacts: [],
        exclusions: [
          {
            item: 'Electrical Panel Upgrade',
            reason: 'Electrical panel upgrade NOT included. Surcharge applies.',
            supporting_excerpt: 'Item 8: Electrical panel upgrade NOT included.',
            source_page: 3,
          },
        ],
        ambiguities: [],
      },
    ];

    const result = runDeterministicComparison({ requirements: sampleRequirements, vendors });
    const upgradeEval = result.find((r) => r.requirementKey === 'panel_upgrade')?.vendorEvaluations['vendor-c'];

    expect(upgradeEval?.status).toBe('excluded');
    expect(upgradeEval?.detail).toContain('Explicitly excluded');
    expect(upgradeEval?.sourcePage).toBe(3);
  });

  it('flags ambiguous warranty language as unclear, never as included', () => {
    const vendors = [
      {
        id: 'vendor-d',
        name: 'Ambiguous Solar',
        extractedFacts: [],
        exclusions: [],
        ambiguities: [
          {
            topic: 'workmanship_warranty',
            ambiguous_text: 'Standard manufacturer warranty applies where permissible.',
            source_page: 4,
            reason: 'Installer workmanship length not stated.',
          },
        ],
      },
    ];

    const result = runDeterministicComparison({ requirements: sampleRequirements, vendors });
    const warrantyEval = result.find((r) => r.requirementKey === 'workmanship_warranty')?.vendorEvaluations['vendor-d'];

    expect(warrantyEval?.status).toBe('unclear');
    expect(warrantyEval?.status).not.toBe('included');
  });

  it('flags conflicting statements in single vendor quotation', () => {
    const vendors = [
      {
        id: 'vendor-e',
        name: 'Contradictory Solar',
        extractedFacts: [
          {
            requirement_key: 'freight_delivery',
            original_wording: 'Delivery included in contract base',
            extracted_value: 'Included',
            statement_classification: 'included' as const,
            exact_source_excerpt: 'Page 1: Freight included',
            source_page: 1,
          },
          {
            requirement_key: 'freight_delivery',
            original_wording: 'Customer responsible for shipping & logistics',
            extracted_value: 'Excluded',
            statement_classification: 'excluded' as const,
            exact_source_excerpt: 'Page 5: Customer pays shipping',
            source_page: 5,
          },
        ],
        exclusions: [],
        ambiguities: [],
      },
    ];

    const result = runDeterministicComparison({ requirements: sampleRequirements, vendors });
    const freightEval = result.find((r) => r.requirementKey === 'freight_delivery')?.vendorEvaluations['vendor-e'];

    expect(freightEval?.status).toBe('conflicting');
    expect(freightEval?.detail).toContain('Conflicting statements');
  });
});
