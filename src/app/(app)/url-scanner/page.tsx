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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { analyzeUrl } from "./actions"
import type { AnalyzeUrlForPhishingOutput } from "@/ai/flows/analyze-url-for-phishing"
import { LoaderCircle, ShieldCheck, ShieldX, Terminal } from "lucide-react"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>URL Phishing Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL to Analyze</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Analyzing..." : "Analyze URL"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isLoading && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Analyzing URL</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-2">Our AI is inspecting the URL for any signs of phishing...</p>
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
                <Card className={result.isPhishing ? "border-destructive" : "border-green-500"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result.isPhishing ? (
                                <ShieldX className="h-6 w-6 text-destructive" />
                            ) : (
                                <ShieldCheck className="h-6 w-6 text-green-500" />
                            )}
                            <span>Analysis Complete</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant={result.isPhishing ? "destructive" : "default"} className={!result.isPhishing ? "bg-green-500/10 border-green-500/50" : ""}>
                            <AlertTitle className="text-lg font-bold">
                                {result.isPhishing ? "Warning: Potential Phishing Attempt" : "This URL appears to be safe."}
                            </AlertTitle>
                            <AlertDescription>
                                Confidence Score: {Math.round(result.confidence * 100)}%
                            </AlertDescription>
                        </Alert>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                            <h4 className="font-semibold">AI Explanation:</h4>
                            <p className="text-sm text-muted-foreground font-code">{result.explanation}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
