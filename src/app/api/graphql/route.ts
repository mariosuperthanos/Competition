import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import typeDefs from '../../../../graphUtils/graphqlSchema';
import prisma from '../../../../lib/prisma';
import resolvers from '../../../../graphUtils/resolvers';

// Eliminat importul nefolosit
// import { startStandaloneServer } from '@apollo/server/standalone'
// import { PrismaClient } from '@prisma/client'; - deja importat prin prisma

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // Context-ul se va transmite la handler, nu aici
});

// Creează handler-ul cu contextul furnizat corect
const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req) => {
    return {
      prisma, // Dacă ai autentificare implementată
    };
  },
});

export async function GET(request: Request) {
  return handler(request);
}

// Adăugăm metoda POST care este esențială pentru GraphQL
export async function POST(request: Request) {
  return handler(request);
}