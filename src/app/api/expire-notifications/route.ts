
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
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
}