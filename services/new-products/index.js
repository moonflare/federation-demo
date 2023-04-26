
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@interfaceObject"])

  extend type Query {
    topProducts(first: Int = 5): [Product] @federation__shareable
  }

  interface Product @key(fields: "id") {
    id: ID!
    name: String!
    description: String
  }

  type Book implements Product @key(fields: "id") @federation__shareable {
    id: ID!
    name: String!
    description: String
  }

  type Movie implements Product @key(fields: "id") @federation__shareable {
    id: ID!
    name: String!
    description: String
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.id === object.id);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});


startStandaloneServer(server, { listen: 4009 }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));

const products = [
  {
    id: "1",
    __typename: "Book",
    description: "Learning GraphQL: Declarative Data Fetching for Modern Web Apps description",
    name: "Learning GraphQL: Declarative Data Fetching for Modern Web Apps",
    price: 39,
    pages: 196
  },
  {
    id: "2",
    __typename: "Book",
    description: "The Road to GraphQL: Your journey to master pragmatic GraphQL in JavaScript with React.js and Node.js",
    name: "The Road to GraphQL: Your journey to master pragmatic GraphQL in JavaScript with React.js and Node.js",
    price: 23,
    pages: 352
  },
  {
    id: "3",
    __typename: "Movie",
    description: "Avatar: The Way of Water",
    name: "Avatar: The Way of Water",
    price: 30,
    duration: 192
  },
  {
    id: "4",
    __typename: "Book",
    description: "GraphQL in Action",
    name: "GraphQL in Action",
    price: 19,
    pages: 384
  },
  {
    id: "5",
    __typename: "Movie",
    description: "Parasite",
    name: "Parasite",
    price: 53,
    duration: 132
  },
  {
    id: "6",
    __typename: "Movie",
    description: "Deadpool",
    name: "Deadpool",
    price: 25,
    duration: 108
  },
];
