import { Context } from "@/app/api/graphql/route";
import { fetchFilteredEvents } from "../library/searchEvents/searchQuery";

const resolvers = {
  Query: {
    // the argument is the title: outside-concert
    // the title from db looks like: Outside Concert
    event: async (_parent: any, args: any, context: Context) => {
      // console.log(args.slug);
      const event = await context.prisma.event.findFirst({
        where: {
          slug: {
            equals: args.slug,
            mode: "insensitive", // ignore uppercase/lowercase
          },
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    },
    events: async (_parent: any, args: any, context: Context) => {
      console.log("args", args);
      const contains = args.contains || "";
      const city = args.city || "";
      const country = args.country || "";
      const shortDate = args.date.slice(0, 10) || ""; // it expects a date string in the format YYYY-MM-DD
      console.log("date", shortDate);
      const filters: any[] = [];

      if (contains) {
        filters.push({
          title: {
            contains: contains,
            mode: "insensitive", // ignore uppercase/lowercase
          },
        });
      }

      if (city) {
        filters.push({
          city: {
            equals: city,
            mode: "insensitive", // ignore uppercase/lowercase
          },
        });
      }

      if (country) {
        filters.push({
          country: {
            equals: country,
            mode: "insensitive", // ignore uppercase/lowercase
          },
        });
      }

      if (shortDate) {
        filters.push({
          startHour: {
            startsWith: shortDate, // Matches the date part of the startHour field
          },
        });
      }

      const events = await context.prisma.event.findMany({
        where: {
          AND: filters,
        },
      });

      if (!events || events.length === 0) {
        throw new Error("No events found");
      }

      return events;
    }
  },
};

export default resolvers;
