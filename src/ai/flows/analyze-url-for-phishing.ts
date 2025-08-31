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
  isSafe: z.boolean().describe('Whether the URL is safe (true) or unsafe (false).'),
  reason: z.string().describe('A short, one-sentence explanation for the assessment.'),
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
  const {output} = await analyzeUrlForPhishingFlow(input);
  return output!;
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
  prompt: `You are an AI security analyzer for the "Guardian Eye" application. Your task is to analyze a URL and determine if it is safe or unsafe.

Your response must be based on:
- URL structure and suspicious keywords (e.g., "login", "secure", "update").
- Domain impersonation of legitimate sites (e.g., "bankofamerica-update.xyz").
- Use of uncommon TLDs associated with scams.

Based on your analysis, decide if the URL is safe or unsafe. Provide a concise, one-sentence reason for your decision. Set 'isSafe' to true for safe sites and false for unsafe ones.

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
    try {
        const {output} = await analyzeUrlPrompt(input);
        return output!;
    } catch (e) {
        console.error("Error in analyzeUrlForPhishingFlow:", e);
        return {
            isSafe: false,
            reason: 'Unable to analyze due to a server or scanning issue. Please try again later.',
        };
    }
  }
);
