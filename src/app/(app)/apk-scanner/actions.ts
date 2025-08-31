'use server'

import { analyzeApkMetadataForMalice, type AnalyzeApkMetadataForMaliceOutput } from '@/ai/flows/analyze-apk-metadata-for-malice'

export async function analyzeApk(apkMetadata: string): Promise<AnalyzeApkMetadataForMaliceOutput> {
  try {
    const result = await analyzeApkMetadataForMalice({ apkMetadata });
    return result;
  } catch (error) {
    console.error("Error analyzing APK metadata:", error);
    throw new Error("Failed to analyze APK metadata due to a server-side error.");
  }
}
