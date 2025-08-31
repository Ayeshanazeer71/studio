import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-apk-metadata-for-malice.ts';
import '@/ai/flows/analyze-url-for-phishing.ts';