"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { LoaderCircle, Link as LinkIcon, AlertTriangle } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 text-center">
      <div className="w-full max-w-2xl space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">URL Scanner</h1>
            <p className="text-muted-foreground">Enter a URL to check if it's safe or unsafe.</p>
        </div>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com"
                        className="w-full pl-10 h-12 text-lg"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full sm:w-auto h-12 px-8 text-lg"
            >
              {isLoading && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Analyzing..." : "Analyze URL"}
            </Button>
          </form>
        </Form>
      
        <div className="h-24 flex items-center justify-center">
          {isLoading && (
              <div className="flex flex-col items-center gap-2">
                  <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Scanning in progress...</p>
              </div>
          )}

          {error && (
              <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle className="h-8 w-8" />
                  <p className="text-lg font-semibold">{error}</p>
              </div>
          )}

          {result && (
              <div className="text-center">
                  <h2 className={cn("text-4xl font-bold", result.isSafe ? 'text-green-600' : 'text-red-600')}>
                  {result.isSafe ? '✅ Safe Website' : '❌ Unsafe Website'}
                  </h2>
                  <p className="text-muted-foreground mt-2 font-mono text-sm">{result.reason}</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
