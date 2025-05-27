import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";

export async function POST(req: Request) {
  try {
    await checkJWT(req);
    const body = await req.json();
    console.log("Received body:", body);
    const { userId, eventId, buttonState } = body;

    if (!userId || !eventId || !buttonState) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.eventRequest.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {
        buttonState,
      },
      create: {
        userId,
        eventId,
        buttonState,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to submit request:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
