import { Context } from "@/app/api/graphql/route";


const resolvers = {
  Query: {
    // the argument is the title: outside-concert
    // the title from db looks like: Outside Concert
    event: async (_parent: any, args: any, context: Context) => {
      console.log(args.slug);
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
  },
};

export default resolvers;
