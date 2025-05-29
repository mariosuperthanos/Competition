import prisma from "../../lib/prisma";
import getImageUrl from "./getS3Image";


type FetchEventParams = {
  contains?: string;
  city?: string;
  country?: string;
  date?: string;
  tags?: string[];
  page?: number;
};

export async function fetchFilteredEvents(
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
  console.log("fetchFilteredEvents called with params:", {
    contains,
    city,
    country,
    date,
    tags,
    page,
  });

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

  const eventsRaw = await prisma.event.findMany({
    where: {
      AND: filters,
    },
    skip: (page - 1) * 10,
    take: 11,
  });
  console.log("eventsRaw", eventsRaw);

  // if (!eventsRaw || eventsRaw.length === 0) {
  //   throw new Error("Error from the server");
  // }

  const events = await Promise.all(
    eventsRaw.slice(0, 11).map(async (event) => {
      const image = await getImageUrl(event.title);
      return {
        ...event,
        image,
      };
    })
  );

  return events;
}
