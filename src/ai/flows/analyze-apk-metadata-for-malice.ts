'use server';

/**
 * @fileOverview Analyzes APK metadata for potential malware or suspicious permissions.
 *
 * - analyzeApkMetadataForMalice - A function that analyzes APK metadata for malice.
 * - AnalyzeApkMetadataForMaliceInput - The input type for the analyzeApkMetadataForMalice function.
 * - AnalyzeApkMetadataForMaliceOutput - The return type for the analyzeApkMetadataForMalice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeApkMetadataForMaliceInputSchema = z.object({
  apkMetadata: z
    .string()
    .describe(
      'The APK metadata to analyze, including permissions, size, and source.'
    ),
});
export type AnalyzeApkMetadataForMaliceInput =
  z.infer<typeof AnalyzeApkMetadataForMaliceInputSchema>;

const AnalyzeApkMetadataForMaliceOutputSchema = z.object({
  isMalicious: z
    .boolean()
    .describe('Whether the APK is likely to be malicious.'),
  reason: z
    .string()
    .describe(
      'The reason why the APK is considered malicious, including suspicious permissions or other metadata anomalies.'
    ),
});
export type AnalyzeApkMetadataForMaliceOutput =
  z.infer<typeof AnalyzeApkMetadataForMaliceOutputSchema>;

export async function analyzeApkMetadataForMalice(
  input: AnalyzeApkMetadataForMaliceInput
): Promise<AnalyzeApkMetadataForMaliceOutput> {
  return analyzeApkMetadataForMaliceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeApkMetadataForMalicePrompt',
  input: {schema: AnalyzeApkMetadataForMaliceInputSchema},
  output: {schema: AnalyzeApkMetadataForMaliceOutputSchema},
  prompt: `You are an expert in Android security. You will analyze the provided APK metadata to determine if the app is likely to be malicious. Pay close attention to the requested permissions and the source of the APK.

APK Metadata: {{{apkMetadata}}}

Based on the metadata, determine if the APK is likely to be malicious and provide a reason for your determination.`,
});

const analyzeApkMetadataForMaliceFlow = ai.defineFlow(
  {
    name: 'analyzeApkMetadataForMaliceFlow',
    inputSchema: AnalyzeApkMetadataForMaliceInputSchema,
    outputSchema: AnalyzeApkMetadataForMaliceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
