export interface PageTextResult {
  pageNumber: number;
  text: string;
}

export interface PdfExtractionResult {
  success: boolean;
  pages: PageTextResult[];
  totalPages: number;
  totalCharacters: number;
  status: 'extracted' | 'needs_ocr' | 'failed';
  errorMessage?: string;
}

/**
 * Normalizes text extracted from PDF:
 * - Collapses redundant horizontal spaces/tabs into single space
 * - Trims lines
 * - Preserves structural line breaks
 */
export function normalizeExtractedText(raw: string): string {
  if (!raw) return '';
  return raw
    .split('\n')
    .map((line) => line.replace(/[ \t\r\f]+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

/**
 * Extracts page-by-page text from a PDF Buffer or ArrayBuffer using pdfjs-dist.
 * Preserves page numbers and detects scanned documents that require OCR.
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer | Uint8Array): Promise<PdfExtractionResult> {
  try {
    // Dynamic import to prevent client bundling issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Ensure worker is configured or standard font data loaded
    const uint8Array = pdfBuffer instanceof Uint8Array ? pdfBuffer : new Uint8Array(pdfBuffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    const totalPages = doc.numPages;
    const pages: PageTextResult[] = [];
    let totalCharacters = 0;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageStrings = textContent.items
        .map((item: any) => (item && 'str' in item ? item.str : ''))
        .filter((str: string) => str.trim().length > 0);

      const pageRawText = pageStrings.join(' ');
      const cleanText = normalizeExtractedText(pageRawText);

      pages.push({
        pageNumber: pageNum,
        text: cleanText,
      });

      totalCharacters += cleanText.length;
    }

    // If document has pages but virtually zero extracted text, it's likely a scanned image
    if (totalPages > 0 && totalCharacters < 40) {
      return {
        success: true,
        pages,
        totalPages,
        totalCharacters,
        status: 'needs_ocr',
        errorMessage: 'Document contains scanned images or non-selectable text. OCR required.',
      };
    }

    return {
      success: true,
      pages,
      totalPages,
      totalCharacters,
      status: 'extracted',
    };
  } catch (error: any) {
    return {
      success: false,
      pages: [],
      totalPages: 0,
      totalCharacters: 0,
      status: 'failed',
      errorMessage: error?.message || 'Failed to extract text from PDF document.',
    };
  }
}
