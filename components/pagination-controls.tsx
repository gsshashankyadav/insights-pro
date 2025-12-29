"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = Math.max(1, currentPage - 2) + i
          if (page > totalPages) return null
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded font-mono text-sm transition-all ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/30 text-foreground hover:border-primary/50"
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <span className="text-xs text-muted-foreground font-mono ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}
