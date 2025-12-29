import type { InsightResponse, AnalyzeRequest } from "./types"

export async function fetchInsights(request: AnalyzeRequest): Promise<InsightResponse> {
  const url = new URL("/api/analyze", window.location.origin)
  url.searchParams.append("url", request.url)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error("Failed to fetch insights")
  }

  return response.json()
}
