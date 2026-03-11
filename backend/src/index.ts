import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadSchema } from '@shared/schema-loader.js';
import { prisma } from '@shared/prisma.js';
import { clientResolvers } from '@clients/adapters/client.resolver.js';

async function bootstrap() {
    console.log("Loading GraphQL schema...");
    const typeDefs = loadSchema();

    const resolvers = {
        Query: {
            ...clientResolvers.Query,
        },
        Mutation: {
            ...clientResolvers.Mutation,
        },
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: process.env.NODE_ENV !== 'production',
    });

    const port = Number(process.env.PORT) || 4000;

    const { url } = await startStandaloneServer(server, {
        listen: { port },
        context: async () => {
            return {
                prisma,
            };
        },
    });

    console.log(`Server ready at: ${url}`);
}

bootstrap().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
