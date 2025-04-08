import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import typeDefs from '../../../../graphUtils/graphqlSchema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import prisma from '../../../../lib/prisma';
import { PrismaClient } from '@prisma/client';

export type Context = {
  prisma: PrismaClient
}

const apolloServer = new ApolloServer<Context>({
  // typedef
  typeDefs,
  // resolver
  resolvers
});

export default startServerAndCreateNextHandler(apolloServer, {
  context: async(req, res) => ({req, res, prisma}),
})