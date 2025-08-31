'use server'

import { analyzeUrlForPhishing, type AnalyzeUrlForPhishingOutput } from '@/ai/flows/analyze-url-for-phishing'

export async function analyzeUrl(url: string): Promise<AnalyzeUrlForPhishingOutput> {
  try {
    const result = await analyzeUrlForPhishing({ url });
    return result;
  } catch (error) {
    console.error("Error analyzing URL:", error);
    // You might want to throw a more specific error or return a structured error response
    throw new Error("Failed to analyze URL due to a server-side error.");
  }
}
