// Use server directive.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a URL to determine if it's a phishing attempt.
 *
 * The flow takes a URL as input and returns a safety assessment in a strict JSON format.
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
  status: z
    .enum(['safe', 'unsafe', 'suspicious', 'error'])
    .describe('The security status of the URL.'),
  confidence: z
    .string()
    .describe('The confidence level (0% to 100%) in the status assessment.'),
  threats: z
    .array(z.enum(['malware', 'phishing', 'spam', 'none']))
    .describe('A list of potential threats identified.'),
  details: z
    .string()
    .describe('A short explanation for the security assessment.'),
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
    // The model might return a JSON string, so we need to parse it.
    if (typeof output === 'string') {
        try {
            return JSON.parse(output);
        } catch (e) {
             console.error('Error parsing JSON output from model:', e);
             return {
                status: 'error',
                confidence: '0%',
                threats: [],
                details: "Failed to parse the analysis result.",
             };
        }
    }
    return output!;

  } catch (error) {
    console.error('Error analyzing URL:', error);
    // Instead of crashing, return a structured error response.
    return {
        status: 'error',
        confidence: '0%',
        threats: [],
        details: 'Unable to analyze due to server or scanning issue.',
    };
  }
}

const analyzeUrlPrompt = ai.definePrompt({
  name: 'analyzeUrlPrompt',
  input: {schema: AnalyzeUrlForPhishingInputSchema},
  output: {schema: AnalyzeUrlForPhishingOutputSchema, format: 'json'},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an AI security analyzer for the "Guardian Eye" application. Your task is to analyze any given URL and return the result in **strict JSON format** only.

Output JSON must follow this structure:

{
  "status": "safe | unsafe | suspicious | error",
  "confidence": "0% to 100%",
  "threats": ["malware", "phishing", "spam", "none"],
  "details": "Short explanation of why this result was given."
}

Rules:
- Never write extra text, only output JSON.
- If URL cannot be analyzed, return:
  {
    "status": "error",
    "confidence": "0%",
    "threats": [],
    "details": "Unable to analyze due to server or scanning issue."
  }

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
    outputSchema: z.any(), // Output can be JSON object or string
  },
  async input => {
    const {output} = await analyzeUrlPrompt(input);
    return output!;
  }
);
