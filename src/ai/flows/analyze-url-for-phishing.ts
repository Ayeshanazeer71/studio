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
  return analyzeUrlForPhishingFlow(input);
}

const analyzeUrlPrompt = ai.definePrompt({
  name: 'analyzeUrlPrompt',
  input: {schema: AnalyzeUrlForPhishingInputSchema},
  output: {schema: AnalyzeUrlForPhishingOutputSchema},
  prompt: `You are an expert in identifying phishing attempts. Analyze the given URL and determine if it is likely a phishing attempt.

URL: {{{url}}}

Consider factors such as URL structure, domain age, presence of security certificates, and content.

Return a JSON object indicating whether the URL is likely a phishing attempt, your confidence level (0-1), and a brief explanation.
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
