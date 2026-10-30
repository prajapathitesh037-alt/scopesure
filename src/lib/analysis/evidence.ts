import { PageTextResult, normalizeExtractedText } from '@/lib/pdf/extract-text';

export interface EvidenceVerificationResult {
  isVerified: boolean;
  matchScore: number; // 0 to 1
  matchedPageNumber: number | null;
  matchedSnippet: string | null;
  verificationNotes: string;
}

/**
 * Verifies whether a claimed excerpt exists in the actual page text of the document.
 * Handles slight punctuation/whitespace variations without permitting hallucinated claims.
 */
export function verifyEvidenceExcerpt(
  claimedExcerpt: string | null | undefined,
  claimedPage: number | null | undefined,
  pages: PageTextResult[]
): EvidenceVerificationResult {
  if (!claimedExcerpt || claimedExcerpt.trim().length === 0) {
    return {
      isVerified: false,
      matchScore: 0,
      matchedPageNumber: null,
      matchedSnippet: null,
      verificationNotes: 'No source excerpt was provided by the extraction.',
    };
  }

  const cleanClaim = normalizeExtractedText(claimedExcerpt).toLowerCase();

  // 1. First search on the specific claimed page if provided
  if (claimedPage && claimedPage > 0) {
    const pageObj = pages.find((p) => p.pageNumber === claimedPage);
    if (pageObj) {
      const cleanTarget = normalizeExtractedText(pageObj.text).toLowerCase();

      // Exact substring match
      if (cleanTarget.includes(cleanClaim)) {
        return {
          isVerified: true,
          matchScore: 1.0,
          matchedPageNumber: claimedPage,
          matchedSnippet: claimedExcerpt,
          verificationNotes: `Verified: Exact excerpt found on Page ${claimedPage}.`,
        };
      }

      // Fuzzy / partial match: if claim is long, check significant chunk
      if (cleanClaim.length > 25) {
        const words = cleanClaim.split(/\s+/);
        const halfWords = words.slice(0, Math.max(4, Math.floor(words.length * 0.75))).join(' ');
        if (cleanTarget.includes(halfWords)) {
          return {
            isVerified: true,
            matchScore: 0.85,
            matchedPageNumber: claimedPage,
            matchedSnippet: claimedExcerpt,
            verificationNotes: `Verified: Strong match on Page ${claimedPage}.`,
          };
        }
      }
    }
  }

  // 2. If not found on claimed page or claimedPage was omitted, check all pages
  for (const page of pages) {
    const cleanTarget = normalizeExtractedText(page.text).toLowerCase();
    if (cleanTarget.includes(cleanClaim)) {
      return {
        isVerified: true,
        matchScore: 0.9,
        matchedPageNumber: page.pageNumber,
        matchedSnippet: claimedExcerpt,
        verificationNotes: `Verified on Page ${page.pageNumber}${claimedPage && claimedPage !== page.pageNumber ? ` (claimed Page ${claimedPage})` : ''}.`,
      };
    }
  }

  // 3. Excerpt not found in actual extracted document text
  return {
    isVerified: false,
    matchScore: 0,
    matchedPageNumber: null,
    matchedSnippet: null,
    verificationNotes: 'Unverified: Could not locate excerpt in document text. Requires human review.',
  };
}
