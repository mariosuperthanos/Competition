import prisma from "../../lib/prisma";


type FetchEventParams = {
  contains?: string;
  city?: string;
  country?: string;
  date?: string;
  tags?: string[];
  page?: number;
};

export async function fetchFilteredEvents(
  prisma: any,
  {
    contains = "",
    city = "",
    country = "",
    date = "",
    tags = [],
    page = 1,
  }: FetchEventParams
) {
  const shortDate = date?.slice(0, 10) || "";
  const filters: any[] = [];

  if (contains) {
    filters.push({
      title: {
        contains,
        mode: "insensitive",
      },
    });
  }

  if (city) {
    filters.push({
      city: {
        equals: city,
        mode: "insensitive",
      },
    });
  }

  if (country) {
    filters.push({
      country: {
        equals: country,
        mode: "insensitive",
      },
    });
  }

  if (shortDate) {
    filters.push({
      startHour: {
        startsWith: shortDate,
      },
    });
  }

  if (tags.length > 0) {
    filters.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  const events = await prisma.event.findMany({
    where: {
      AND: filters,
    },
    skip: (page - 1) * 10,
    take: 11,
  });

  if (!events || events.length === 0) {
    throw new Error("Error from the server");
  }

  return events;
}
