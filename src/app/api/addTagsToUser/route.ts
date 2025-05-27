import prisma from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import checkJWT from "../../../../library/create-eventAPI/checkJWT"

export async function POST(req: Request) {
  const { tags } = await req.json()

  try {
    const userId = await checkJWT(req);

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
