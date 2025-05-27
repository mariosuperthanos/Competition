import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";

export async function POST(req: Request) {
  try {
    await checkJWT(req);
    const body = await req.json();
    console.log("Received body:", body);
    const { title, clientName, buttonState, id } = body;

    if (!title || !clientName || !buttonState) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (buttonState === "accepted" || buttonState === "rejected") {
      const message =
        buttonState === "accepted"
          ? `User accepted.`
          : `User rejejected`;

      await prisma.notification.update({
        where: {
          id
        },
        data: {
          message,
          responded: true,
        },
      });
    }


    // Get eventId based on title
    const event = await prisma.event.findFirst({
      where: { title },
      select: { id: true },
    });

    // Get userId based on clientName
    const user = await prisma.user.findFirst({
      where: { name: clientName },
      select: { id: true },
    });

    if (!event || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid title or clientName" },
        { status: 404 }
      );
    }

    const eventId = event.id;
    const userId = user.id;

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
