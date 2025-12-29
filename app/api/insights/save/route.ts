import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import type { InsightResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, insights , title} = (await request.json()) as {
      url: string
      insights: InsightResponse
      title: string
    }

    if (!url || !insights) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const savedResponse = await prisma.savedResponse.create({
      data: {
        user: {
          connectOrCreate: {
            where: { clerkId: userId },
            create: {
              clerkId: userId,
              email: "",
            },
          },
        },
        url,
        title,
        painPoints: insights.pain_points,
        buyingIntent: insights.buying_intent,
        patterns: insights.repeated_patterns,
        quotes: insights.exact_user_quotes,
        fullResponse: insights,
      },
    })

    return NextResponse.json({ success: true, id: savedResponse.id }, { status: 201 })
  } catch (error) {
    console.error("Save insights error:", error)
    return NextResponse.json({ error: "Failed to save insights" }, { status: 500 })
  }
}
