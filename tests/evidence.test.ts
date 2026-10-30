import { describe, it, expect } from 'vitest';
import { verifyEvidenceExcerpt } from '@/lib/analysis/evidence';

describe('Evidence Verification Engine', () => {
  const samplePages = [
    {
      pageNumber: 1,
      text: 'SUNPOWER RESIDENTIAL SOLAR PROPOSAL\nPrepared for John Doe\nSystem Capacity: 10.4 kW DC\nTotal Turnkey Price: $28,500',
    },
    {
      pageNumber: 2,
      text: 'EQUIPMENT SPECIFICATIONS\nSolar Modules: 26x REC Alpha Pure-R Series 400W monocrystalline panels.\nInverters: Enphase IQ8M microinverters with integrated rapid shutdown.',
    },
    {
      pageNumber: 3,
      text: 'WARRANTY INFORMATION\nWorkmanship Warranty: 25 years full coverage on roof penetrations and installation labor.',
    },
  ];

  it('verifies exact quote excerpt on correct page', () => {
    const result = verifyEvidenceExcerpt(
      '26x REC Alpha Pure-R Series 400W monocrystalline panels',
      2,
      samplePages
    );

    expect(result.isVerified).toBe(true);
    expect(result.matchScore).toBe(1.0);
    expect(result.matchedPageNumber).toBe(2);
  });

  it('locates excerpt even if claimed page was slightly off but exists in document', () => {
    const result = verifyEvidenceExcerpt(
      '25 years full coverage on roof penetrations',
      1, // Claimed page 1, but actually on page 3
      samplePages
    );

    expect(result.isVerified).toBe(true);
    expect(result.matchedPageNumber).toBe(3);
    expect(result.verificationNotes).toContain('claimed Page 1');
  });

  it('rejects hallucinated or invented excerpt with clear unverified status', () => {
    const result = verifyEvidenceExcerpt(
      'Tesla Powerwall 3 Included for free with solar purchase',
      1,
      samplePages
    );

    expect(result.isVerified).toBe(false);
    expect(result.matchScore).toBe(0);
    expect(result.matchedPageNumber).toBeNull();
    expect(result.verificationNotes).toContain('Unverified');
  });

  it('handles empty or missing excerpt safely without crashing', () => {
    const result = verifyEvidenceExcerpt(null, null, samplePages);
    expect(result.isVerified).toBe(false);
    expect(result.verificationNotes).toContain('No source excerpt was provided');
  });
});
