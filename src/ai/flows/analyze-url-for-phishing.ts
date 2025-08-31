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
  status: z
    .enum(['Safe', 'Suspicious', 'Malicious', 'Error'])
    .describe('The security status of the URL.'),
  confidence: z
    .number()
    .describe(
      'The confidence level (0-1) in the status assessment.'
    ),
  reason: z
    .string()
    .describe('A simple explanation for the security assessment.'),
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
      status: 'Error',
      confidence: 0,
      reason: "Unable to analyze due to server issue, please try again later",
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
  prompt: `You are a security AI. I will give you a URL. Your task is to:

First, check if the URL is accessible (without actually opening malicious links).

Then analyze the structure of the domain (e.g., is it similar to a real brand like Bank of America but suspicious?).

Detect if it looks like phishing, scam, or safe.

Finally, give a clear report with:

Status: Safe / Suspicious / Malicious / Error

Confidence: %

Reason in simple words.

URL: {{{url}}}
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
