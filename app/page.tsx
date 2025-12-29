"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import UrlInput from "@/components/url-input"
import AnalyzeButton from "@/components/analyze-button"
import LoadingOverlay from "@/components/loading-overlay"
import ResultsTabs from "@/components/results-tabs"
import UserMenu from "@/components/user-menu"
import { fetchInsights } from "@/lib/api"
import type { InsightResponse } from "@/lib/types"

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [url, setUrl] = useState("")
  const [insights, setInsights] = useState<InsightResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!isSignedIn) {
      setError("Please sign in first to analyze Reddit discussions")
      return
    }

    if (!url) {
      setError("Please paste a Reddit URL")
      return
    }

    if (!url.includes("reddit.com")) {
      setError("Please enter a valid Reddit URL")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const data = await fetchInsights({ url })
      setInsights(data)

      setSaveLoading(true)
      try {
        const cleanUrl = url.endsWith(".json") ? url.slice(0, -5) : url

        const response = await fetch("/api/insights/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: cleanUrl,
            insights: data,
            title: data.title || cleanUrl,
          }),
        })

        if (!response.ok) {
          console.error("Failed to auto-save insights")
        }
      } catch (err) {
        console.error("Auto-save error:", err)
      } finally {
        setSaveLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-mono font-semibold">Insights</h2>
          {isLoaded && <UserMenu isSignedIn={isSignedIn} user={user} />}
        </div>
      </div>

      <div className="border-b border-border/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-40">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-serif font-bold leading-tight animate-slide-in-up text-balance">
              Insights
            </h1>
            <p
              className="text-lg text-muted-foreground font-mono animate-slide-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Extract structured intelligence from Reddit discussions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wider">
              Reddit URL
            </label>
            <UrlInput value={url} onChange={setUrl} onSubmit={handleAnalyze} />
          </div>

          <AnalyzeButton onClick={handleAnalyze} disabled={loading} />

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm animate-slide-in-up">
              {error}
            </div>
          )}
        </div>
      </div>

      {insights && !loading && <ResultsTabs insights={insights} url={url} />}

      {loading && <LoadingOverlay />}
    </main>
  )
}
