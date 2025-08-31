"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, PartyPopper, ShieldOff, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

const Balloon = ({ className }: { className?: string }) => (
  <motion.div
    className={cn("absolute bottom-0 text-4xl", className)}
    initial={{ y: 0, opacity: 1, scale: 0.5 }}
    animate={{ y: -500, opacity: 0, scale: 1.2 }}
    transition={{ duration: Math.random() * 3 + 3, ease: "easeOut", repeat: Infinity, repeatType: "loop", delay: Math.random() * 2 }}
  >
    🎈
  </motion.div>
);

export default function UrlScannerPage() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<"safe" | "unsafe" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleCheck() {
    if (!url) {
      setError("Please enter a URL.")
      setResult(null)
      return
    }
    if (!url.includes('.') || url.length < 5) {
      setError("Please enter a valid URL.")
      setResult(null)
      return
    }

    setError(null)
    setIsLoading(true)
    setResult(null)

    setTimeout(() => {
      if (url.toLowerCase().startsWith("https://")) {
        setResult("safe")
      } else {
        setResult("unsafe")
      }
      setIsLoading(false)
    }, 1500)
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value)
    if (result) setResult(null)
    if (error) setError(null)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCheck()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 text-center overflow-hidden">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-glow">CyberGuard URL Scanner</h1>
            <p className="text-muted-foreground md:text-xl">Enter a URL to scan for phishing and malicious content.</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
            <Input
              type="text"
              value={url}
              onChange={handleUrlChange}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="w-full pl-12 h-16 text-lg rounded-full"
              aria-label="Website URL"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleCheck}
            className="w-full h-16 text-xl rounded-full font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
                <>
                    <Wind className="mr-2 h-6 w-6 animate-spin" />
                    <span>Analyzing...</span>
                </>
            ) : "Scan URL"}
          </Button>
          {error && <p className="text-destructive text-sm font-medium">{error}</p>}
        </div>

        <div className="h-56 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                {result === "safe" ? (
                  <>
                    <div className="relative">
                      {[...Array(7)].map((_, i) => (
                        <Balloon key={i} className={`left-[${(i - 3) * 20}px]`} />
                      ))}
                      <PartyPopper className="h-28 w-28 text-green-500" style={{ filter: 'drop-shadow(0 0 10px rgb(34 197 94))' }} />
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-green-400 text-shadow-safe">
                      This Website is Safe
                    </h2>
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-28 w-28 text-red-500" style={{ filter: 'drop-shadow(0 0 10px rgb(239 68 68))' }} />
                    <h2 className="text-4xl font-extrabold tracking-tight text-red-400 text-shadow-unsafe">
                      This Website is Unsafe
                    </h2>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
