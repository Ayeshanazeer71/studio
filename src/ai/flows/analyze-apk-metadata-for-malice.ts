'use server';

/**
 * @fileOverview Analyzes an APK's source for potential malware or suspicious attributes.
 *
 * - analyzeApkSourceForMalice - A function that analyzes an APK source for malice.
 * - AnalyzeApkSourceForMaliceInput - The input type for the analyzeApkSourceForMalice function.
 * - AnalyzeApkSourceForMaliceOutput - The return type for the analyzeApkSourceForMalice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeApkSourceForMaliceInputSchema = z.object({
  apkSource: z
    .string()
    .describe(
      'The source of the APK to analyze, such as a URL or a description of where it was found.'
    ),
});
export type AnalyzeApkSourceForMaliceInput =
  z.infer<typeof AnalyzeApkSourceForMaliceInputSchema>;

const AnalyzeApkSourceForMaliceOutputSchema = z.object({
  isMalicious: z
    .boolean()
    .describe('Whether the APK is likely to be malicious.'),
  reason: z
    .string()
    .describe(
      'The reason why the APK is considered malicious, including suspicious permissions, source reputation, or other metadata anomalies.'
    ),
});
export type AnalyzeApkSourceForMaliceOutput =
  z.infer<typeof AnalyzeApkSourceForMaliceOutputSchema>;

export async function analyzeApkSourceForMalice(
  input: AnalyzeApkSourceForMaliceInput
): Promise<AnalyzeApkSourceForMaliceOutput> {
  return analyzeApkSourceForMaliceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeApkSourceForMalicePrompt',
  input: {schema: AnalyzeApkSourceForMaliceInputSchema},
  output: {schema: AnalyzeApkSourceForMaliceOutputSchema},
  prompt: `You are an expert in Android security. Your task is to analyze the provided APK source information to determine if an app from that source is likely to be malicious.

Consider the following factors:
- The reputation of the source URL or platform. Is it a known official app store or a third-party site?
- The description of the app. Does it make suspicious claims?
- Infer potential permissions based on the app's description and common malware patterns (e.g., a simple game asking for contact access is suspicious).

APK Source Information: {{{apkSource}}}

Based on this information, determine if the APK is likely to be malicious and provide a concise reason for your determination. Focus on the most critical risk factors.`,
});

const analyzeApkSourceForMaliceFlow = ai.defineFlow(
  {
    name: 'analyzeApkSourceForMaliceFlow',
    inputSchema: AnalyzeApkSourceForMaliceInputSchema,
    outputSchema: AnalyzeApkSourceForMaliceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
