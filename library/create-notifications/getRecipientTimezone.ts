import prisma from "../../lib/prisma";

const getRecipientTimezoneAndId = async (
  recipientName: string
): Promise<{ recipientId: string | null; recipientTimezone: string }> => {
  try {
    const recipient = await prisma.user.findUnique({
      where: {
        name: recipientName,
      },
      select: {
        id: true,
        timezone: true,
      },
    });

    return {
      recipientId: recipient?.id ?? null,
      recipientTimezone: recipient?.timezone ?? "UTC",
    };
  } catch (error) {
    console.error("Error fetching recipient:", error);
    return {
      recipientId: null,
      recipientTimezone: "UTC",
    };
  }
};

export default getRecipientTimezoneAndId;
