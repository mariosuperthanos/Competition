import { DateTime } from "luxon";
import prisma from "../../lib/prisma";

interface NotificationInput {
  title: string;
  message: string;
  date: string;
  purpose: string;
}

interface RecipientTimezone {
  timezone?: string;
}

interface RecipientId {
  id?: string;
}

const createManyNotifications = async (
  notifications: NotificationInput[],
  recipientTimezone: RecipientTimezone,
  recipientId: RecipientId
): Promise<void> => {

  console.log("userTimezone", recipientTimezone);
  console.log("recipientId", recipientId);
  console.log("notifications", notifications);
  try {
    await prisma.notification.createMany({
      data: notifications.map((n: NotificationInput) => {
        const zone = recipientTimezone;

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
          recipient: recipientId ?? "unknown",
        };
      }),
    });
  } catch (err: any) {
    console.error("Error creating notifications:", err);
    throw new Error(err.message);
  }
}

export default createManyNotifications;