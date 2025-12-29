import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        responses: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return NextResponse.json({ responses: user?.responses || [] })
  } catch (error) {
    console.error("List insights error:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}
