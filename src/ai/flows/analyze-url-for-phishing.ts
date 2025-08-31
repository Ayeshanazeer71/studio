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
 * Output schema for the URL analysis, indicating if the URL is likely a phishing attempt.
 */
const AnalyzeUrlForPhishingOutputSchema = z.object({
  isPhishing: z
    .boolean()
    .describe('Whether the URL is likely a phishing attempt.'),
  confidence: z
    .number()
    .describe(
      'The confidence level (0-1) that the URL is a phishing attempt.'
    ),
  explanation: z
    .string()
    .describe('Explanation of why the URL is considered phishing.'),
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
    return await analyzeUrlForPhishingFlow(input);
  } catch (error) {
    console.error('Error analyzing URL:', error);
    // Instead of crashing, return a structured error response.
    return {
      isPhishing: true, // Treat errors as suspicious
      confidence: 0,
      explanation: "Error analyzing URL. Please try again later.",
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
  prompt: `You are a security assistant.
Your task is to analyze the given URL and decide if it is safe or potentially fake (phishing/malicious).

Steps to follow:
1. Check if the domain name looks suspicious (e.g., unusual spellings, extra words like "update", "secure-login", "free-gift", etc.).
2. Compare with well-known domains (e.g., "bankofamerica.com" is real, but "bankofamerica-update-account.xyz" is suspicious).
3. Identify if the URL uses uncommon TLDs (.xyz, .top, .ru) often linked with scams.

URL: {{{url}}}

Based on your analysis, provide an explanation. If the site is suspicious, your explanation should be "Suspicious Website ⚠️". If it looks fine, it should be "Safe Website ✅".
Set the isPhishing flag accordingly.
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
