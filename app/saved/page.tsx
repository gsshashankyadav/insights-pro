"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import type { SavedResponse } from "@prisma/client"
import FilterControls from "@/components/filter-controls"
import PaginationControls from "@/components/pagination-controls"
import { Trash2 } from "lucide-react"

const ITEMS_PER_PAGE = 12

export default function SavedPage() {
  const { isLoaded, isSignedIn } = useUser()
  const [responses, setResponses] = useState<SavedResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) return

    const fetchResponses = async () => {
      try {
        const res = await fetch("/api/insights/list")
        const data = await res.json()
        setResponses(data.responses)
      } catch (error) {
        console.error("Failed to fetch saved responses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [isSignedIn])

  const filteredResponses = responses.filter((response) => {
    const matchesKeyword =
      !keyword ||
      response.title.toLowerCase().includes(keyword.toLowerCase()) ||
      response.url.toLowerCase().includes(keyword.toLowerCase())

    const responseDate = new Date(response.createdAt)
    const matchesStartDate = !startDate || responseDate >= new Date(startDate)
    const matchesEndDate = !endDate || responseDate <= new Date(endDate + "T23:59:59")

    return matchesKeyword && matchesStartDate && matchesEndDate
  })

  const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE)
  const paginatedResponses = filteredResponses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, startDate, endDate])

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const res = await fetch("/api/insights/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete")

      setResponses((prev) => prev.filter((r) => r.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error("Failed to delete response:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Sign in to view saved analyses</h1>
          <Link href="/" className="text-primary hover:underline font-mono">
            Return to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-mono font-semibold">Saved Analyses</h2>
          <Link href="/" className="text-sm font-mono text-primary hover:text-primary/80">
            New Analysis
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : responses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-serif font-bold mb-2">No saved analyses yet</h3>
            <p className="text-muted-foreground mb-6">Analyze a Reddit discussion and save it to view it here</p>
            <Link
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:bg-primary/90"
            >
              Start analyzing
            </Link>
          </div>
        ) : (
          <>
            <FilterControls
              keyword={keyword}
              setKeyword={setKeyword}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {filteredResponses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No analyses match your filters</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 mt-8">
                  {paginatedResponses.map((response, idx) => (
                    <div
                      key={response.id}
                      className="p-6 bg-card/40 border border-border/30 backdrop-blur-sm rounded-lg hover:border-primary/50 transition-all duration-300 hover:bg-card/60 animate-slide-in-up group"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/saved/${response.id}`} className="flex-1">
                          <h3 className="font-mono text-sm text-primary hover:underline cursor-pointer">
                            {response.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </span>
                          {deleteConfirm === response.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(response.id)}
                                disabled={deletingId === response.id}
                                className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50 transition-all"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 text-xs border border-border/30 text-foreground rounded hover:border-primary/50 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(response.id)}
                              className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete analysis"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <Link 
                          href={response.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground/70 hover:text-primary truncate block hover:underline transition-colors mb-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {response.url}
                      </Link>

                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{response.painPoints.length} pain points</span>
                        <span>{response.buyingIntent.length} buying signals</span>
                        <span>{response.patterns.length} patterns</span>
                        <span>{response.quotes.length} quotes</span>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
