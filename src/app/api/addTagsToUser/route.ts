import prisma from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const { userId, tags } = await req.json()

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        tags: {
          set: tags
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Update failed", details: error }, { status: 500 })
  }
}
