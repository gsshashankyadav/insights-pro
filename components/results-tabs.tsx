"use client"

import { useState } from "react"
import type { InsightResponse } from "@/lib/types"
import InsightSection from "@/components/insight-section"
import QuoteCard from "@/components/quote-card"

interface ResultsTabsProps {
  insights: InsightResponse
  url: string
}

export default function ResultsTabs({ insights, url }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<"pain-points" | "buying-intent" | "patterns" | "quotes">("pain-points")

  const tabs = [
    { id: "pain-points", label: "Pain Points", count: insights.pain_points.length },
    { id: "buying-intent", label: "Buying Intent", count: insights.buying_intent.length },
    { id: "patterns", label: "Patterns", count: insights.repeated_patterns.length },
    { id: "quotes", label: "Quotes", count: insights.exact_user_quotes.length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 pb-24 animate-fade-in">
      <div className="mb-12 border-b border-border/20 pb-8">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-balance">
            {insights.title || "Reddit Discussion"}
          </h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline font-mono break-all block hover:text-primary/80 transition-colors"
          >
            {url}
          </a>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-border/20">
        <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Analysis Results</h3>
        <span className="text-xs font-mono text-muted-foreground">Auto-saved</span>
      </div>

      <div className="mb-12 border-b border-border/20">
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

      <div className="min-h-[400px]">
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
  )
}
