import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const response = await prisma.savedResponse.findUnique({
      where: { id },
    })

    if (!response) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Verify user owns this response
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || response.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Fetch insight error:", error)
    return NextResponse.json({ error: "Failed to fetch insight" }, { status: 500 })
  }
}
