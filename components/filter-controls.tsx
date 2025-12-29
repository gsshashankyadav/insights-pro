"use client"

import { Search, Calendar } from "lucide-react"

interface FilterControlsProps {
  keyword: string
  setKeyword: (keyword: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
}

export default function FilterControls({
  keyword,
  setKeyword,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: FilterControlsProps) {
  return (
    <div className="space-y-4 p-6 bg-card/40 border border-border/30 backdrop-blur-sm rounded-lg">
      <div>
        <label className="block text-sm font-mono text-muted-foreground mb-2">Search by title or URL</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search analyses..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {(keyword || startDate || endDate) && (
        <button
          onClick={() => {
            setKeyword("")
            setStartDate("")
            setEndDate("")
          }}
          className="w-full text-sm font-mono text-primary hover:text-primary/80 py-2 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
