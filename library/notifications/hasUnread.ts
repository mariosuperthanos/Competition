import { DateTime } from "luxon";
import prisma from "../../lib/prisma";

const hasUnreadNotifications = async (userId: string, timezone: string): Promise<boolean> => {
  const now = DateTime.now().setZone(timezone);
  
  const allNotifications = await prisma.notification.findMany({
    where: {
      recipient: userId,
      read: false
    },
  });
  console.log(allNotifications);

  const filteredNotifications = allNotifications.filter(n => {
    const notifDate = DateTime.fromFormat(n.date, "yyyy-MM-dd'T'HH:mm:ss z");
    console.log("notifDate", notifDate);
    console.log("now", now);
    return notifDate <= now;
  })
  return filteredNotifications.length > 0 ? true : false;
};


export default hasUnreadNotifications;