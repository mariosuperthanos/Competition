import { Context } from "@/app/api/graphql/route";

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
      const contains = args.contains || "";
      const city = args.city || "";
      const country = args.country || "";
      const shortDate = args.date?.slice(0, 10) || "";
      const tags = args.tags || [];
      const page = args.page || 1; // default to page 1

      const filters: any[] = [];

      if (contains) {
        filters.push({
          title: {
            contains: contains,
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

      const events = await context.prisma.event.findMany({
        where: {
          AND: filters,
        },
        skip: (page - 1) * 10,
        take: 11, // 10 for display + 1 to check if there's a next page
      });

      if (!events || events.length===0) {
        throw new Error("Error from the server")
      }
      return events;
    }
  },
};

export default resolvers;
