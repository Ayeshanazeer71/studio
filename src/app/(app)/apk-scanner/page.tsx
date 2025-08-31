"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyzeApk } from "./actions"
import type { AnalyzeApkSourceForMaliceOutput } from "@/ai/flows/analyze-apk-metadata-for-malice"
import { LoaderCircle, ShieldCheck, ShieldX, Terminal, FileSignature } from "lucide-react"

const formSchema = z.object({
  source: z.string().min(5, { message: "Please provide a valid source (e.g., URL or app store name)." }),
})

export default function ApkScannerPage() {
  const [result, setResult] = useState<AnalyzeApkSourceForMaliceOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { source: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const analysisResult = await analyzeApk(values.source)
      setResult(analysisResult)
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div 
        className="w-full max-w-2xl mx-auto space-y-8"
      >
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-glow">
            APK Source Scanner
          </h1>
        </header>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FileSignature className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                          <Input 
                              placeholder="Enter APK source (URL or store page)" 
                              className="pl-12 h-14"
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
                  className="w-full h-14 text-lg font-bold"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Analyze Source"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="min-h-[200px] flex items-center justify-center">
            <AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                        <LoaderCircle className="h-10 w-10 animate-spin text-purple-400 mx-auto" />
                        <p className="mt-4 text-lg font-semibold text-purple-300">Analyzing source...</p>
                        <p className="text-sm text-purple-400/70">Our AI is deploying cyber agents to check for risks.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <Terminal className="h-10 w-10 text-red-500 mx-auto" />
                        <p className="mt-4 text-lg font-bold text-red-400">Analysis Failed</p>
                        <p className="text-sm text-red-500/80 font-mono">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {result && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.5, type: "spring" }}
                      className="w-full"
                    >
                        <Card className={`bg-transparent shadow-lg border-2 ${result.isMalicious ? 'border-red-500 shadow-unsafe' : 'border-green-500 shadow-safe'}`}>
                            <CardHeader className="text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 10 }}
                                >
                                    {result.isMalicious ? (
                                        <ShieldX 
                                          className="h-20 w-20 text-red-500 mx-auto"
                                          style={{ filter: 'drop-shadow(0 0 10px rgb(239 68 68))' }} 
                                        />
                                    ) : (
                                        <ShieldCheck
                                            className="h-20 w-20 text-green-500 mx-auto"
                                            style={{ filter: 'drop-shadow(0 0 10px rgb(34 197 94))' }}
                                        />
                                    )}
                                </motion.div>
                                <CardTitle 
                                  className={`text-3xl font-bold mt-4 ${result.isMalicious ? 'text-red-400 text-shadow-unsafe' : 'text-green-400 text-shadow-safe'}`}
                                >
                                    {result.isMalicious ? "Unsafe" : "Safe"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="p-4 bg-background/50 rounded-md border border-purple-500/20 mt-2">
                                    <h4 className="font-semibold text-purple-300">AI Explanation:</h4>
                                    <p className="font-mono text-sm text-white/80 mt-1">{result.reason}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
