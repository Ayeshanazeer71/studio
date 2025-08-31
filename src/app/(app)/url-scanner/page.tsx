"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react"

export default function UrlScannerPage() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<"safe" | "unsafe" | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleCheck() {
    if (!url) {
      setError("Please enter a URL.")
      setResult(null)
      return
    }
    // Basic validation for demo
    if (!url.includes('.') || url.length < 5) {
      setError("Please enter a valid URL.")
      setResult(null)
      return
    }

    setError(null)
    // Simulate the check as requested
    if (url.toLowerCase().startsWith("https://")) {
      setResult("safe")
    } else {
      setResult("unsafe")
    }
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value)
    // Reset result when user types a new URL
    if (result) {
      setResult(null)
    }
    if (error) {
        setError(null)
    }
  }
  
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleCheck()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 text-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={url}
              onChange={handleUrlChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter website URL"
              className="w-full pl-10 h-14 text-lg rounded-full"
              aria-label="Website URL"
            />
          </div>
          <Button
            onClick={handleCheck}
            className="w-full h-14 text-lg rounded-full"
          >
            Check URL
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="h-48 flex items-center justify-center">
          {result && (
            <div className="flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ease-in-out animate-in fade-in">
              {result === "safe" ? (
                <>
                  <CheckCircle2 className="h-24 w-24 text-green-500" />
                  <p className="text-3xl font-bold text-green-500">
                    This website is Safe
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-24 w-24 text-red-500" />
                  <p className="text-3xl font-bold text-red-500">
                    This website is Unsafe
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
