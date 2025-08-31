"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { analyzeUrl } from "./actions"
import type { AnalyzeUrlForPhishingOutput } from "@/ai/flows/analyze-url-for-phishing"
import { LoaderCircle, ShieldCheck, ShieldX, Link as LinkIcon, AlertTriangle, ShieldQuestion } from "lucide-react"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})

const getStatusStyles = (status: AnalyzeUrlForPhishingOutput['status']) => {
    switch (status) {
        case 'Malicious':
            return {
                borderColor: 'border-red-500/50',
                textColor: 'text-red-400',
                icon: <ShieldX className="h-20 w-20 text-red-500" />,
                title: 'Malicious Threat Detected',
                gradient: 'bg-gradient-to-r from-red-600 to-red-400',
            };
        case 'Suspicious':
            return {
                borderColor: 'border-yellow-500/50',
                textColor: 'text-yellow-400',
                icon: <ShieldQuestion className="h-20 w-20 text-yellow-500" />,
                title: 'Potentially Suspicious',
                gradient: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
            };
        case 'Safe':
            return {
                borderColor: 'border-green-500/50',
                textColor: 'text-green-400',
                icon: <ShieldCheck className="h-20 w-20 text-green-500" />,
                title: 'URL Appears Safe',
                gradient: 'bg-gradient-to-r from-green-600 to-green-400',
            };
        default: // Error
            return {
                borderColor: 'border-gray-500/50',
                textColor: 'text-gray-400',
                icon: <AlertTriangle className="h-20 w-20 text-gray-500" />,
                title: 'Analysis Error',
                gradient: 'bg-gradient-to-r from-gray-600 to-gray-400',
            };
    }
}


export default function UrlScannerPage() {
  const [result, setResult] = useState<AnalyzeUrlForPhishingOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const analysisResult = await analyzeUrl(values.url)
      setResult(analysisResult)
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const confidenceLevel = result ? Math.round(result.confidence * 100) : 0;
  const statusStyles = result ? getStatusStyles(result.status) : getStatusStyles('Error');


  return (
    <div className="min-h-[calc(100vh-60px)] bg-black text-pink-300 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ff007f 0%, #000000 70%)',
        }}
      />
      <div className="relative z-10 w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
            CyberGuard URL Scanner
          </h1>
          <p className="mt-2 text-pink-400/80">
            Enter a URL to scan for phishing and malicious content.
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400/50" />
                      <Input
                        placeholder="https://example.com"
                        className="w-full pl-12 pr-4 py-3 bg-black/50 border-2 border-pink-500/30 rounded-full text-lg text-pink-300 placeholder:text-pink-400/50 transition-all duration-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 shadow-[0_0_15px_rgba(255,0,127,0.2)] focus:shadow-[0_0_30px_rgba(255,0,127,0.4)]"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full md:w-auto text-lg font-bold bg-pink-600 text-black rounded-full px-10 py-6 transition-all duration-300 hover:bg-pink-500 hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] transform hover:scale-105 active:scale-100 disabled:opacity-50"
            >
              {isLoading && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Analyzing..." : "Scan URL"}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mt-8">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-black/50 border border-pink-500/30 rounded-2xl backdrop-blur-sm text-center"
            >
              <LoaderCircle className="h-8 w-8 text-pink-400 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-pink-300">Scanning in progress...</p>
              <p className="text-pink-400/80">Our AI is dissecting the digital DNA of the URL.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-red-900/30 border border-red-500/50 rounded-2xl backdrop-blur-sm text-center"
            >
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-300">Analysis Failed</h3>
              <p className="text-red-400/80">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className={cn(
                "p-6 bg-black/50 border rounded-2xl backdrop-blur-sm shadow-[0_0_40px_rgba(255,0,127,0.2)]",
                statusStyles.borderColor
              )}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                   {statusStyles.icon}
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className={cn("text-2xl font-bold", statusStyles.textColor)}>
                    {statusStyles.title}
                  </h2>
                   <div className="relative mt-2 h-6 w-full bg-gray-700/50 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className={cn("h-full rounded-full", statusStyles.gradient)}
                      style={{ width: `${confidenceLevel}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidenceLevel}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/90">
                      {confidenceLevel}% Confidence
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/10">
                <h4 className="font-semibold text-pink-400 mb-2">AI Analysis Report:</h4>
                <p className="text-sm text-pink-300/80 font-mono">{result.reason}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
