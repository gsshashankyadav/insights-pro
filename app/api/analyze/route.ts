import { NextResponse } from "next/server"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import type { InsightResponse } from "@/lib/types"

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    pain_points: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Frustrations, challenges, or negative experiences shared by users.",
    },
    buying_intent: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Indications that users want to buy, subscribe, or hire a service/product.",
    },
    repeated_patterns: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Common themes, frequently asked questions, or recurring advice.",
    },
    exact_user_quotes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Powerful or representative direct quotes from the discussion.",
    },
  },
  required: ["pain_points", "buying_intent", "repeated_patterns", "exact_user_quotes"],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redditUrl = searchParams.get("url")

    if (!redditUrl) {
      return NextResponse.json({ error: "URL parameter required" }, { status: 400 })
    }

    if (!redditUrl.includes("reddit.com")) {
      return NextResponse.json({ error: "Invalid Reddit URL" }, { status: 400 })
    }

    const apiUrl = redditUrl.endsWith(".json") ? redditUrl : `${redditUrl}.json`

    const genAI = new GoogleGenerativeAI(process.env.API_KEY || "")
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    })

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AnalysisTool/1.0" },
      next: { revalidate: 3600 },
    } )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data from Reddit", response }, { status: 400 })
    }

    const data = await response.json()

    const postData = data[0]?.data?.children[0]?.data
    if (!postData) {
      return NextResponse.json({ error: "Post content not found" }, { status: 404 })
    }

    const comments = data[1]?.data?.children
      ?.map((c: any) => c.data.body)
      .filter((text: string) => text && text !== "[deleted]" && text !== "[removed]")
      .slice(0, 50)

    const contextPayload = {
      title: postData.title,
      content: postData.selftext,
      comments: comments || [],
    }

    const prompt = `Perform a comprehensive analysis of the following Reddit discussion. 
    Identify core problems, interest in solutions/purchases, recurring themes, and notable quotes.
    Data: ${JSON.stringify(contextPayload)}`

    const result = await model.generateContent(prompt)
    const analysis: InsightResponse = JSON.parse(result.response.text())

    analysis.title = postData.title

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error during processing:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
