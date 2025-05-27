
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";

export async function POST(req: Request) {
  try {
    await checkJWT(req);
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { read: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
