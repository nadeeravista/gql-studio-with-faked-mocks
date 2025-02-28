import { ApolloServer, gql } from 'apollo-server';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';

// URL of the GitHub GraphQL API schema
const schemaUrl = 'http://localhost:3002/graphql/schema/schema.graphql';

async function startServer() {
  // Fetch the schema from the URL
  const response = await fetch(schemaUrl);
  const schemaString = await response.text();

  try {
    // Load the schema
    const typeDefs = gql(schemaString);

    // Create an executable schema
    const schema = makeExecutableSchema({ typeDefs });

    // Define custom mocks with random data
    const mocks = {
      Int: () => faker.number.int(),
      Float: () => faker.number.float(),
      String: () => faker.lorem.word(),
      Boolean: () => faker.datatype.boolean(),
      ID: () => faker.string.uuid(),
      // Add more custom mocks for specific types if needed
    };

    // Add mocks to the schema
    const schemaWithMocks = addMocksToSchema({ schema, mocks });

    // Create an instance of ApolloServer with the mocked schema
    const server = new ApolloServer({ schema: schemaWithMocks });

    // Start the server
    server.listen({ port: 4002 }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });

  } catch {
    console.error('Error adding mocks to the schema: Shema URL might be incorrect');
  }
}

startServer();