import { describe, it, expect } from 'vitest';
import { normalizeExtractedText } from '@/lib/pdf/extract-text';

describe('PDF Text Extraction & Normalization', () => {
  it('collapses redundant spaces and tabs without breaking line structure', () => {
    const raw = '   Solar Panels:    REC 400W  \t\t \n\n   Inverter:   Enphase IQ8M   \n';
    const normalized = normalizeExtractedText(raw);

    expect(normalized).toBe('Solar Panels: REC 400W\nInverter: Enphase IQ8M');
  });

  it('handles empty text and whitespace-only text safely', () => {
    expect(normalizeExtractedText('')).toBe('');
    expect(normalizeExtractedText('   \n  \t  \n  ')).toBe('');
  });
});
