"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { SavedResponse } from "@prisma/client"
import InsightSection from "@/components/insight-section"
import QuoteCard from "@/components/quote-card"
import type { InsightResponse } from "@/lib/types"
import { Trash2 } from "lucide-react"

export default function SavedDetailPage() {
  const { isLoaded, isSignedIn } = useUser()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [savedResponse, setSavedResponse] = useState<SavedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"pain-points" | "buying-intent" | "patterns" | "quotes">("pain-points")
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !id) return

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/insights/${id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setSavedResponse(data.response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analysis")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [isSignedIn, id])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const res = await fetch("/api/insights/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete")
      router.push("/saved")
    } catch (error) {
      console.error("Failed to delete response:", error)
      setDeleteConfirm(false)
      setDeleting(false)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-background" />

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Sign in to view this analysis</h1>
          <Link href="/" className="text-primary hover:underline font-mono">
            Return to home
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="text-muted-foreground">Loading analysis...</div>
        </div>
      </main>
    )
  }

  if (error || !savedResponse) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4 text-destructive">{error || "Analysis not found"}</h1>
          <Link href="/saved" className="text-primary hover:underline font-mono">
            Back to saved analyses
          </Link>
        </div>
      </main>
    )
  }

  const insights = savedResponse.fullResponse as unknown as InsightResponse

  const tabs = [
    { id: "pain-points", label: "Pain Points", count: insights.pain_points.length },
    { id: "buying-intent", label: "Buying Intent", count: insights.buying_intent.length },
    { id: "patterns", label: "Patterns", count: insights.repeated_patterns.length },
    { id: "quotes", label: "Quotes", count: insights.exact_user_quotes.length },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-mono font-semibold">Analysis Details</h2>
          <div className="flex gap-4 items-center">
            {deleteConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm font-mono px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50 transition-all"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="text-sm font-mono px-3 py-1 border border-border/30 text-foreground rounded hover:border-primary/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Delete analysis"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <Link href="/saved" className="text-sm font-mono text-primary hover:text-primary/80">
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-balance">{savedResponse.title}</h1>
            <a
              href={savedResponse.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-mono break-all block hover:text-primary/80 transition-colors"
            >
              {savedResponse.url}
            </a>
            <p className="text-xs text-muted-foreground">
              Analyzed {new Date(savedResponse.createdAt).toLocaleDateString()} at{" "}
              {new Date(savedResponse.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="mb-12 border-b border-border/20 mt-12">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-mono text-sm transition-all duration-300 relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  <span className="text-xs bg-card px-2 py-1 rounded-full">{tab.count}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px] animate-fade-in">
          {activeTab === "pain-points" && (
            <InsightSection
              title="Pain Points"
              items={insights.pain_points}
              description="Key challenges and frustrations expressed by users"
              index={0}
            />
          )}

          {activeTab === "buying-intent" && (
            <InsightSection
              title="Buying Intent"
              items={insights.buying_intent}
              description="Signals indicating purchase readiness and product interest"
              index={0}
            />
          )}

          {activeTab === "patterns" && (
            <InsightSection
              title="Repeated Patterns"
              items={insights.repeated_patterns}
              description="Common themes and recurring discussions"
              index={0}
            />
          )}

          {activeTab === "quotes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-serif font-bold mb-2">User Quotes</h2>
                <p className="text-muted-foreground">Direct user voice from the community</p>
              </div>
              <div className="space-y-4">
                {insights.exact_user_quotes.map((quote, idx) => (
                  <div key={idx} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-slide-in-up">
                    <QuoteCard quote={quote} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
