import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";
import { DateTime } from "luxon";
import getRecipientTimezoneAndId from "../../../../library/create-notifications/getRecipientTimezone";
import createManyNotifications from "../../../../library/create-notifications/createManyNotifications";

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
    const { recipientTimezone, recipientId } = await getRecipientTimezoneAndId(notifications[0].recipient);


    await createManyNotifications(notifications, recipientTimezone, recipientId);

    return NextResponse.json({ message: "Notifications created" }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating notifications:", err);
    return NextResponse.json({ message: err.message }, { status: 501 });
  }
}

export { POST };