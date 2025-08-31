import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Link as LinkIcon, FileCode } from "lucide-react"

const threats = [
  {
    type: "URL",
    value: "http://verify-yoursecurity-details.com",
    reason: "Domain mimics a legitimate financial institution to steal credentials.",
    timestamp: "2 minutes ago",
    severity: "High",
  },
  {
    type: "APK",
    value: "FreeAntivirus.apk",
    reason: "Requests excessive permissions, including reading contacts and sending SMS messages.",
    timestamp: "15 minutes ago",
    severity: "Critical",
  },
  {
    type: "URL",
    value: "http://amazon-prime-rewardz.net",
    reason: "Suspicious TLD (.net) for an Amazon-related site. Aims to collect personal information.",
    timestamp: "45 minutes ago",
    severity: "High",
  },
  {
    type: "APK",
    value: "PhotoEditorPro.apk",
    reason: "Contains known spyware libraries that exfiltrate user data to a remote server.",
    timestamp: "1 hour ago",
    severity: "Critical",
  },
  {
    type: "URL",
    value: "http://microsft-support-online.info",
    reason: "Misspelled domain name ('microsft') to impersonate Microsoft support.",
    timestamp: "3 hours ago",
    severity: "High",
  },
  {
    type: "URL",
    value: "http://secure.bankofamerica.com.login.ws",
    reason: "Uses multiple subdomains to obscure the true, non-bank domain.",
    timestamp: "5 hours ago",
    severity: "Medium",
  },
]

const getSeverityBadge = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "destructive"
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    default:
      return "outline"
  }
}

export default function ThreatFeedPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Threat Feed</h1>
          <p className="text-muted-foreground">
            A real-time feed of newly detected phishing sites and malicious apps.
          </p>
        </header>
        
        <div className="flow-root">
          <ul className="-mb-8">
            {threats.map((threat, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== threats.length - 1 ? (
                    <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div>
                      <span className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center ring-8 ring-background">
                        <ShieldAlert className="h-5 w-5 text-destructive" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <div className="font-medium text-foreground flex items-center gap-2">
                                {threat.type === 'URL' ? <LinkIcon className="h-4 w-4 text-muted-foreground"/> : <FileCode className="h-4 w-4 text-muted-foreground"/>}
                                <span className="font-mono text-sm truncate">{threat.value}</span>
                            </div>
                            <time dateTime={threat.timestamp} className="flex-shrink-0 text-muted-foreground">
                                {threat.timestamp}
                            </time>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{threat.reason}</p>
                        <Badge variant={getSeverityBadge(threat.severity)} className="mt-2">{threat.severity}</Badge>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
