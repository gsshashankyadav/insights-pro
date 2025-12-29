import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing insight ID" }, { status: 400 })
    }

    const response = await prisma.savedResponse.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!response || response.user.clerkId !== userId) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    await prisma.savedResponse.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete insight error:", error)
    return NextResponse.json({ error: "Failed to delete insight" }, { status: 500 })
  }
}
