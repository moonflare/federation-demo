const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@external", "@interfaceObject", "@provides", "@requires", "@shareable"])

  extend type Product @key(fields: "id") @interfaceObject {
    id: ID! @external
    price: Float @external
    name: String! @shareable
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price")
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find(product => product.id === object.id)
      };
    },
    name(object) {
      return `Product: ${object.id}!`;
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.price + 30;
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});


startStandaloneServer(server, { listen: 4004 }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));


const inventory = [
  { id: "1", inStock: true },
  { id: "2", inStock: false },
  { id: "3", inStock: true },
  { id: "4", inStock: false },
  { id: "5", inStock: true },
  { id: "6", inStock: true }
];
