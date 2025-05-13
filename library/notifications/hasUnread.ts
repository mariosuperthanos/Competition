import prisma from "../../lib/prisma";

const hasUnreadNotifications = async (userId?: string): Promise<boolean> => {
  const condition = userId ? { read: false, userId } : { read: true };

  const notification = await prisma.notification.findFirst({
    where: condition,
    select: { id: true },
  });

  return !!notification;
};


export default hasUnreadNotifications;