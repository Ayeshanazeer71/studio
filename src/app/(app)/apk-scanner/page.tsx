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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { analyzeApk } from "./actions"
import type { AnalyzeApkMetadataForMaliceOutput } from "@/ai/flows/analyze-apk-metadata-for-malice"
import { LoaderCircle, ShieldCheck, ShieldX, Terminal } from "lucide-react"

const formSchema = z.object({
  permissions: z.string().min(10, { message: "Please provide permissions details." }),
  size: z.string().min(1, { message: "Please provide APK size (e.g., 25MB)." }),
  source: z.string().min(3, { message: "Please provide APK source (e.g., app store name, website)." }),
})

export default function ApkScannerPage() {
  const [result, setResult] = useState<AnalyzeApkMetadataForMaliceOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { permissions: "", size: "", source: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    const metadata = `Permissions: ${values.permissions}\nSize: ${values.size}\nSource: ${values.source}`
    try {
      const analysisResult = await analyzeApk(metadata)
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
          <CardTitle>APK Metadata Scanner</CardTitle>
          <CardDescription>Enter the APK's metadata to check for potential risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., android.permission.INTERNET, android.permission.READ_CONTACTS"
                        className="min-h-[100px] font-code"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50MB" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Source</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Google Play Store, third-party site" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Analyzing..." : "Analyze APK"}
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
                            <span>Analyzing APK Metadata</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-2">Our AI is checking permissions and other metadata for suspicious patterns...</p>
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
                                {result.isMalicious ? "Warning: Potentially Malicious App" : "This App appears to be safe."}
                            </AlertTitle>
                        </Alert>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                            <h4 className="font-semibold">AI Explanation:</h4>
                            <p className="text-sm text-muted-foreground font-code">{result.reason}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
