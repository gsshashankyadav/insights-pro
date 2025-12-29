export interface InsightResponse {
  title?: string
  pain_points: string[]
  buying_intent: string[]
  repeated_patterns: string[]
  exact_user_quotes: string[]
}

export interface AnalyzeRequest {
  url: string
}
