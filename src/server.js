"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const mock_1 = require("@graphql-tools/mock");
const schema_1 = require("@graphql-tools/schema");
const node_fetch_1 = __importDefault(require("node-fetch"));
const faker_1 = require("@faker-js/faker");
// URL of the GitHub GraphQL API schema
const schemaUrl = 'https://raw.githubusercontent.com/octokit/graphql-schema/master/schema.graphql';
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the schema from the URL
        const response = yield (0, node_fetch_1.default)(schemaUrl);
        const schemaString = yield response.text();
        // Load the schema
        const typeDefs = (0, apollo_server_1.gql)(schemaString);
        // Create an executable schema
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs });
        // Define custom mocks with random data
        const mocks = {
            Int: () => faker_1.faker.number.int(),
            Float: () => faker_1.faker.number.float(),
            String: () => faker_1.faker.lorem.word(),
            Boolean: () => faker_1.faker.datatype.boolean(),
            ID: () => faker_1.faker.string.uuid(),
            // Add more custom mocks for specific types if needed
        };
        // Add mocks to the schema
        const schemaWithMocks = (0, mock_1.addMocksToSchema)({ schema, mocks });
        // Create an instance of ApolloServer with the mocked schema
        const server = new apollo_server_1.ApolloServer({ schema: schemaWithMocks });
        // Start the server
        server.listen({ port: 4002 }).then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
        });
    });
}
startServer();
