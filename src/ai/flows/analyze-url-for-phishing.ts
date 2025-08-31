// Use server directive.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a URL to determine if it's a phishing attempt.
 *
 * The flow takes a URL as input and returns a safety assessment.
 * The exported function `analyzeUrlForPhishing` is the entry point for this flow.
 *
 * @remarks
 *   - analyzeUrlForPhishing: Analyzes a given URL for phishing attempts.
 *   - AnalyzeUrlForPhishingInput: The input type for the analyzeUrlForPhishing function.
 *   - AnalyzeUrlForPhishingOutput: The return type for the analyzeUrlForPhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the URL analysis.
 */
const AnalyzeUrlForPhishingInputSchema = z.object({
  url: z.string().describe('The URL to analyze.'),
});
export type AnalyzeUrlForPhishingInput = z.infer<
  typeof AnalyzeUrlForPhishingInputSchema
>;

/**
 * Output schema for the URL analysis, providing a structured security report.
 */
const AnalyzeUrlForPhishingOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the URL is safe or not.'),
  reason: z.string().describe('A short explanation for the security assessment.'),
});
export type AnalyzeUrlForPhishingOutput = z.infer<
  typeof AnalyzeUrlForPhishingOutputSchema
>;

/**
 * Analyzes a URL to determine if it's a phishing attempt.
 * @param input - The input containing the URL to analyze.
 * @returns A promise resolving to the analysis result.
 */
export async function analyzeUrlForPhishing(
  input: AnalyzeUrlForPhishingInput
): Promise<AnalyzeUrlForPhishingOutput> {
  try {
    const {output} = await analyzeUrlForPhishingFlow(input);
    return output!;

  } catch (error) {
    console.error('Error analyzing URL:', error);
    // Instead of crashing, return a structured error response.
    return {
        isSafe: false,
        reason: 'Unable to analyze due to server or scanning issue. Please try again later.',
    };
  }
}

const analyzeUrlPrompt = ai.definePrompt({
  name: 'analyzeUrlPrompt',
  input: {schema: AnalyzeUrlForPhishingInputSchema},
  output: {schema: AnalyzeUrlForPhishingOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an AI security analyzer for the "Guardian Eye" application. Your task is to analyze any given URL and determine if it is safe or not.

  Your response should be based on the following factors:
  - The URL's structure and whether it mimics legitimate sites (e.g., "bankofamerica-update.xyz" is suspicious).
  - The use of uncommon TLDs often associated with scams.
  - Presence of suspicious keywords like "login," "secure," "update," etc. in a strange context.

  Based on your analysis, decide if the URL is safe. Provide a concise reason for your decision.

  URL to analyze: {{{url}}}
`,
});

/**
 * Genkit flow for analyzing a URL for phishing.
 */
const analyzeUrlForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeUrlForPhishingFlow',
    inputSchema: AnalyzeUrlForPhishingInputSchema,
    outputSchema: AnalyzeUrlForPhishingOutputSchema,
  },
  async input => {
    const {output} = await analyzeUrlPrompt(input);
    return output!;
  }
);
