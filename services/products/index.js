
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@shareable"])

  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  interface Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float
  }

  type Book implements Product @key(fields: "id") @shareable {
    id: ID!
    name: String!
    price: Float
    pages: Int
  }

  type Movie implements Product @key(fields: "id") @shareable {
    id: ID!
    name: String!
    price: Float
    duration: Int
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


startStandaloneServer(server, { listen: 4003 }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));

const products = [
  {
    id: "1",
    __typename: "Book",
    name: "Learning GraphQL: Declarative Data Fetching for Modern Web Apps",
    price: 399,
    pages: 196
  },
  {
    id: "2",
    __typename: "Book",
    name: "The Road to GraphQL: Your journey to master pragmatic GraphQL in JavaScript with React.js and Node.js",
    price: 23,
    pages: 352
  },
  {
    id: "3",
    __typename: "Movie",
    name: "Avatar: The Way of Water",
    price: 30,
    duration: 192
  },
  {
    id: "4",
    __typename: "Book",
    name: "GraphQL in Action",
    price: 19,
    pages: 384
  },
  {
    id: "5",
    __typename: "Movie",
    name: "Parasite",
    price: 53,
    duration: 132
  },
  {
    id: "6",
    __typename: "Movie",
    name: "Deadpool",
    price: 25,
    duration: 108
  },
];
