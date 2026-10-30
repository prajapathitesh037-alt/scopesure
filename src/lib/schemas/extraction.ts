import { z } from 'zod';

export const findingStatusSchema = z.enum([
  'included',
  'excluded',
  'not_specified',
  'unclear',
  'conflicting',
]);

export const lineItemSchema = z.object({
  original_description: z.string(),
  normalized_requirement_key: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  currency: z.string().default('USD'),
  supporting_excerpt: z.string().nullable().optional(),
  source_page: z.number().int().positive().nullable().optional(),
  extraction_status: findingStatusSchema.default('included'),
});

export const extractedFactSchema = z.object({
  requirement_key: z.string(),
  original_wording: z.string(),
  extracted_value: z.string().nullable().optional(),
  statement_classification: findingStatusSchema,
  exact_source_excerpt: z.string().nullable().optional(),
  source_page: z.number().int().positive().nullable().optional(),
});

export const structuredQuotationExtractionSchema = z.object({
  vendor_name: z.string().nullable().optional(),
  quote_reference: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  quoted_total: z.number().nullable().optional(),
  line_items: z.array(lineItemSchema).default([]),
  warranty_terms: z.array(z.object({
    type: z.string(),
    duration_years: z.number().nullable().optional(),
    description: z.string(),
    supporting_excerpt: z.string().nullable().optional(),
    source_page: z.number().int().positive().nullable().optional(),
  })).default([]),
  installation_terms: z.array(z.object({
    scope_description: z.string(),
    is_included: z.boolean(),
    supporting_excerpt: z.string().nullable().optional(),
    source_page: z.number().int().positive().nullable().optional(),
  })).default([]),
  exclusions: z.array(z.object({
    item: z.string(),
    reason: z.string().nullable().optional(),
    supporting_excerpt: z.string().nullable().optional(),
    source_page: z.number().int().positive().nullable().optional(),
  })).default([]),
  extracted_facts: z.array(extractedFactSchema).default([]),
  ambiguities: z.array(z.object({
    topic: z.string(),
    ambiguous_text: z.string(),
    source_page: z.number().int().positive().nullable().optional(),
    reason: z.string(),
  })).default([]),
});

export type StructuredQuotationExtraction = z.infer<typeof structuredQuotationExtractionSchema>;
export type ExtractedFact = z.infer<typeof extractedFactSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
