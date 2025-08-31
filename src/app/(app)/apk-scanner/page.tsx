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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { analyzeApk } from "./actions"
import type { AnalyzeApkSourceForMaliceOutput } from "@/ai/flows/analyze-apk-metadata-for-malice"
import { LoaderCircle, ShieldCheck, ShieldX, Terminal, FileCode } from "lucide-react"

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>APK Source Scanner</CardTitle>
          <CardDescription>Enter the APK's source (e.g., a URL or store page) to check for potential risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>APK Source</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="e.g., https://play.google.com/store/apps/details?id=com.example.app" 
                            className="pl-10"
                            {...field} 
                            disabled={isLoading} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Analyzing..." : "Analyze Source"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isLoading && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Analyzing APK Source</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-2">Our AI is checking the source for suspicious patterns and potential risks...</p>
                        <Progress value={undefined} className="w-full h-2 animate-pulse" />
                    </CardContent>
                </Card>
             </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className={result.isMalicious ? "border-destructive" : "border-green-500"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result.isMalicious ? (
                                <ShieldX className="h-6 w-6 text-destructive" />
                            ) : (
                                <ShieldCheck className="h-6 w-6 text-green-500" />
                            )}
                            <span>Analysis Complete</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant={result.isMalicious ? "destructive" : "default"} className={!result.isMalicious ? "bg-green-500/10 border-green-500/50" : ""}>
                            <AlertTitle className="text-lg font-bold">
                                {result.isMalicious ? "Warning: Potentially Malicious Source" : "This source appears to be safe."}
                            </AlertTitle>
                        </Alert>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                            <h4 className="font-semibold">AI Explanation:</h4>
                            <p className="text-sm text-muted-foreground font-mono">{result.reason}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
