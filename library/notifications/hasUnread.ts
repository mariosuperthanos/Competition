import { DateTime } from "luxon";
import prisma from "../../lib/prisma";

const hasUnreadNotifications = async (userId: string, timezone: string): Promise<boolean> => {
  const now = DateTime.now().setZone(timezone);
  console.log("userIdddd", userId);

  const allNotifications = await prisma.notification.findMany({
    where: {
      recipient: userId,
    },
  });

  console.log("allNotifications", allNotifications);
  const filteredNotifications = allNotifications.filter(n => {
    const notifDate = DateTime.fromFormat(n.date, "yyyy-MM-dd'T'HH:mm:ss z");
    console.log("notifDate", notifDate);
    console.log("now", now);
    return notifDate <= now;
  })
  // Count unread notifications
  const unreadCount = filteredNotifications.filter((notification) => notification.read === false).length
  console.log("filteredNotifications", filteredNotifications.filter((notification) => notification.read === false))
  console.log("unreadCount", unreadCount);
  if (unreadCount > 0) {
    return true;
  } else {
    return false;
  }
};


export default hasUnreadNotifications;