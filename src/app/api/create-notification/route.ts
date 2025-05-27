import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";
import { DateTime } from "luxon";

const POST = async (req: Request) => {
  try {
    const userid = await checkJWT(req);

    const body = await req.json();
    const notifications: {
      title: string;
      message: string;
      date: string;
      purpose: string;
      recipient: string;
      timezone: string;
    }[] = body.notifications;

    if (!Array.isArray(notifications)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // get the recipient timezone by name
    const recipientTimezone = await prisma.user.findUnique({
      where: {
        name: notifications[0].recipient,
      },
      select: {
        timezone: true,
      },
    });

    const recipientId = await prisma.user.findUnique({
      where: {
        name: notifications[0].recipient,
      },
      select: {
        id: true,
      },
    });
    console.log("recipientId", recipientId);

    console.log("recipientTimezone", recipientTimezone);


    await prisma.notification.createMany({
      data: notifications.map((n) => {
        const zone = recipientTimezone?.timezone ?? 'UTC';

        const zonedDate = DateTime
          .fromISO(n.date, { zone: 'utc' })
          .setZone(zone)
          .toFormat("yyyy-MM-dd'T'HH:mm:ss z");

        console.log(typeof zonedDate, zonedDate);
        return {
          title: n.title,
          message: n.message,
          date: zonedDate,
          purpose: n.purpose,
          recipient: recipientId?.id ?? "unknown",
        };
      }),
    });

    return NextResponse.json({ message: "Notifications created" }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating notifications:", err);
    return NextResponse.json({ message: err.message }, { status: 501 });
  }
}

export { POST };