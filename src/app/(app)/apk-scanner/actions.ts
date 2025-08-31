'use server'

import { analyzeApkSourceForMalice, type AnalyzeApkSourceForMaliceOutput } from '@/ai/flows/analyze-apk-metadata-for-malice'

export async function analyzeApk(apkSource: string): Promise<AnalyzeApkSourceForMaliceOutput> {
  try {
    const result = await analyzeApkSourceForMalice({ apkSource });
    return result;
  } catch (error) {
    console.error("Error analyzing APK source:", error);
    throw new Error("Failed to analyze APK source due to a server-side error.");
  }
}
