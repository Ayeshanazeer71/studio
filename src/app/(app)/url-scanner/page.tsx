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
import { Badge } from "@/components/ui/badge"
import { analyzeUrl } from "./actions"
import type { AnalyzeUrlForPhishingOutput } from "@/ai/flows/analyze-url-for-phishing"
import { LoaderCircle, ShieldCheck, ShieldX, Link as LinkIcon, AlertTriangle, ShieldQuestion } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})

const getStatusStyles = (status: AnalyzeUrlForPhishingOutput['status']) => {
    switch (status) {
        case 'unsafe':
            return {
                borderColor: 'border-red-500',
                textColor: 'text-red-700',
                icon: <ShieldX className="h-12 w-12 text-red-500" />,
                title: 'Malicious Threat Detected',
                bgColor: 'bg-red-50',
            };
        case 'suspicious':
            return {
                borderColor: 'border-yellow-500',
                textColor: 'text-yellow-700',
                icon: <ShieldQuestion className="h-12 w-12 text-yellow-500" />,
                title: 'Potentially Suspicious',
                bgColor: 'bg-yellow-50',
            };
        case 'safe':
            return {
                borderColor: 'border-green-500',
                textColor: 'text-green-700',
                icon: <ShieldCheck className="h-12 w-12 text-green-500" />,
                title: 'URL Appears Safe',
                bgColor: 'bg-green-50',
            };
        default: // error
            return {
                borderColor: 'border-gray-400',
                textColor: 'text-gray-700',
                icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
                title: 'Analysis Error',
                bgColor: 'bg-gray-50',
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
  
  const statusStyles = result ? getStatusStyles(result.status) : getStatusStyles('error');


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">CyberGuard URL Scanner</CardTitle>
          <p className="text-muted-foreground">
            Enter a URL to scan for phishing and malicious content.
          </p>
        </CardHeader>
        <CardContent>
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
                          className="w-full pl-10"
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
                className="w-full sm:w-auto"
              >
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Analyzing..." : "Scan URL"}
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
                <CardContent className="pt-6 text-center">
                <LoaderCircle className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-lg font-semibold">Scanning in progress...</p>
                <p className="text-muted-foreground">Our AI is analyzing the URL.</p>
                </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="border-destructive bg-destructive/5">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <CardTitle className="text-destructive">Analysis Failed</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className={cn("border-2", statusStyles.borderColor, statusStyles.bgColor)}>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {statusStyles.icon}
                        <div className="flex-1 text-center md:text-left">
                        <h2 className={cn("text-xl font-bold", statusStyles.textColor)}>
                            {statusStyles.title}
                        </h2>
                        <p className="text-muted-foreground font-semibold">{result.confidence} Confidence</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.threats && result.threats.length > 0 && result.threats[0] !== 'none' && (
                        <div>
                            <h4 className="font-semibold mb-2">Identified Threats:</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.threats.map((threat, index) => (
                                    <Badge key={index} variant="destructive">{threat}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="p-4 bg-background/50 rounded-md space-y-2">
                        <h4 className="font-semibold">AI Analysis Report:</h4>
                        <p className="text-sm text-muted-foreground font-mono">{result.details}</p>
                    </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
