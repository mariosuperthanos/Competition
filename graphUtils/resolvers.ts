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
        // return await fetchFilteredEvents(context.prisma, {
        //   contains: args.contains,
        //   city: args.city,
        //   country: args.country,
        //   date: args.date,
        //   tags: args.tags,
        //   page: args.page,
        // });
    }
  },
};

export default resolvers;
