import { getNebiusClient } from '@/lib/nebius/client';
import { getEnv } from '@/lib/env';

export interface ClarificationDraftInput {
  vendorName: string;
  findingTitle: string;
  findingDescription: string;
  recommendedAction: string;
  sourceDoc?: string | null;
  sourcePage?: number | null;
}

export interface ClarificationDraftOutput {
  subject: string;
  messageBody: string;
  isAiGenerated: boolean;
}

/**
 * Generates an editable, professional vendor clarification inquiry
 * using NVIDIA Nemotron via Nebius Token Factory (with deterministic fallback).
 */
export async function generateClarificationDraft(
  input: ClarificationDraftInput
): Promise<ClarificationDraftOutput> {
  const client = getNebiusClient();
  const env = getEnv();

  const fallbackSubject = `Clarification Request: Solar Quotation - ${input.findingTitle}`;
  const fallbackBody = `Dear ${input.vendorName} Team,\n\nWe are currently reviewing your solar quotation proposal${input.sourceDoc ? ` (${input.sourceDoc})` : ''} for our installation project.\n\nDuring our scope review, we identified the following item that requires clarification:\n- Concern: ${input.findingDescription}\n\nSpecific Clarification Requested:\n${input.recommendedAction}\n\nPlease confirm whether this item is included in the base proposal or if an additional fee applies, and provide revised documentation if necessary.\n\nThank you for your prompt assistance.\n\nSincerely,\nSolar Procurement Team`;

  if (!client) {
    return {
      subject: fallbackSubject,
      messageBody: fallbackBody,
      isAiGenerated: false,
    };
  }

  const prompt = `You are an assistant for a solar quotation comparison system. Write a polite, concise, professional business email to vendor "${input.vendorName}" requesting clarification on the following audit finding:

Finding: ${input.findingTitle}
Description: ${input.findingDescription}
Action needed: ${input.recommendedAction}
Document reference: ${input.sourceDoc || 'Quotation'} (Page ${input.sourcePage || 'N/A'})

Do not invent facts or numbers. Keep it professional and concise.
Output a JSON object with two fields:
{
  "subject": "string",
  "message_body": "string"
}`;

  try {
    const response = await client.chat.completions.create({
      model: env.NEBIUS_MODEL,
      messages: [
        { role: 'system', content: 'You generate professional, polite contractor inquiry emails. Output JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      subject: parsed.subject || fallbackSubject,
      messageBody: parsed.message_body || fallbackBody,
      isAiGenerated: true,
    };
  } catch (error: any) {
    console.warn('[Nebius AI] Clarification generation error, using fallback template:', error.message);
    return {
      subject: fallbackSubject,
      messageBody: fallbackBody,
      isAiGenerated: false,
    };
  }
}
