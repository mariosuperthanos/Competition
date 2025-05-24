import { getServerSession } from "next-auth";
import { Notification } from "../../../components/notification/Notification";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import { cookies } from "next/headers";
import { DateTime } from "luxon";
import ExpireNotifications from "../../../components/ExpireNotifications";

// purpose can be: "allow/reject", "response to allow/reject", "ask for particitation"

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const timezoneData = cookieStore.get("timezoneData")?.value;
  const parsedData = JSON.parse(timezoneData!);
  const timezone = parsedData.data.timezone;
  console.log("timezoneData", timezone);

  const session = await getServerSession(authOptions);
  const userId = session?.token.id;
  const now = DateTime.now().setZone(timezone);
  const formatted = now.toFormat("yyyy-MM-dd'T'HH:mm:ss z");
  console.log("user", userId);
  // Check if the user is authenticated
  // Sample notifications data

  const notifications = [
    {
      id: 1,
      title: "New Feature Available",
      message: "We've just launched a new feature that you might be interested in.",
      date: new Date(2023, 4, 15, 9, 30),
      isSeen: false,
      interactive: true,
    },
    {
      id: 2,
      title: "Your subscription is expiring soon",
      message: "Your premium subscription will expire in 3 days. Renew now to avoid interruption.",
      date: new Date(2023, 4, 14, 15, 45),
      isSeen: false,
      interactive: true,
    },
    {
      id: 3,
      title: "Welcome to our platform!",
      message: "Thank you for joining. Explore our features to get the most out of your experience.",
      date: new Date(2023, 4, 10, 11, 20),
      isSeen: true,
      interactive: false,
    },
    {
      id: 4,
      title: "Security Alert",
      message: "We noticed a login from a new device. Please verify if this was you.",
      date: new Date(2023, 4, 8, 18, 15),
      isSeen: true,
      interactive: false,
    },
  ]
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
  console.log("filteredNotifications", filteredNotifications);
  // Count unread notifications
  const unreadCount = filteredNotifications.filter((notification) => !notification.read).length

  const idsToUpdate = filteredNotifications.map(n => n.id);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredNotifications.map((notification) => {
        console.log(notification);
        return (
          <Notification
            key={notification.id}
            title={notification.title}
            message={notification.message}
            date={notification.date}
            isSeen={!notification.read}
            purpose={notification.responded == true ? "" : notification.purpose }
            id={notification.id}
          />
        );
      })}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have any notifications yet.</p>
        </div>
      )}
      <ExpireNotifications idsToUpdate={idsToUpdate}></ExpireNotifications>
    </main >
  );
}
