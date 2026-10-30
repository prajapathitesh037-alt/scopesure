import { describe, it, expect } from 'vitest';
import { uploadUrlRequestSchema } from '@/lib/schemas/project';
import { structuredQuotationExtractionSchema } from '@/lib/schemas/extraction';

describe('Validation Engine', () => {
  it('accepts valid PDF and TXT file uploads within size limit', () => {
    const validPdf = uploadUrlRequestSchema.safeParse({
      vendor_name: 'SunPower',
      filename: 'quote_2026.pdf',
      mime_type: 'application/pdf',
      file_size_bytes: 5242880, // 5MB
    });
    expect(validPdf.success).toBe(true);

    const validTxt = uploadUrlRequestSchema.safeParse({
      vendor_name: 'Local Installer',
      filename: 'quote.txt',
      mime_type: 'text/plain',
      file_size_bytes: 2048,
    });
    expect(validTxt.success).toBe(true);
  });

  it('rejects unsupported file extensions (e.g. executable, docx)', () => {
    const invalidFile = uploadUrlRequestSchema.safeParse({
      vendor_name: 'Malicious Installer',
      filename: 'invoice.exe',
      mime_type: 'application/x-msdownload',
      file_size_bytes: 1024,
    });
    expect(invalidFile.success).toBe(false);
  });

  it('rejects oversized files exceeding 10MB limit', () => {
    const oversizedFile = uploadUrlRequestSchema.safeParse({
      vendor_name: 'Big Proposal',
      filename: 'huge_quote.pdf',
      mime_type: 'application/pdf',
      file_size_bytes: 15 * 1024 * 1024, // 15MB
    });
    expect(oversizedFile.success).toBe(false);
  });

  it('validates structured AI extraction against strict schema', () => {
    const validAiOutput = {
      vendor_name: 'SunPower',
      quote_reference: 'Q-2026-01',
      currency: 'USD',
      quoted_total: 28500,
      line_items: [
        {
          original_description: '26x REC 400W Solar Panels',
          amount: 15000,
          currency: 'USD',
          extraction_status: 'included',
        },
      ],
      warranty_terms: [
        {
          type: 'workmanship',
          duration_years: 25,
          description: '25-year workmanship',
          source_page: 2,
        },
      ],
      installation_terms: [],
      exclusions: [],
      extracted_facts: [
        {
          requirement_key: 'solar_panels',
          original_wording: '26x REC 400W panels',
          statement_classification: 'included',
          exact_source_excerpt: '26x REC 400W panels',
          source_page: 2,
        },
      ],
      ambiguities: [],
    };

    const result = structuredQuotationExtractionSchema.safeParse(validAiOutput);
    expect(result.success).toBe(true);
  });

  it('rejects invalid AI classification status (e.g. "maybe" or "estimated")', () => {
    const invalidAiOutput = {
      vendor_name: 'SunPower',
      extracted_facts: [
        {
          requirement_key: 'solar_panels',
          original_wording: 'Panels',
          statement_classification: 'maybe_included', // Not in allowed enum
        },
      ],
    };

    const result = structuredQuotationExtractionSchema.safeParse(invalidAiOutput);
    expect(result.success).toBe(false);
  });
});

