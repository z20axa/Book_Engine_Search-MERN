// // packages/modules imports
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// setting computer port number for service and Heruko deployment
const PORT = process.env.PORT || 3001;

// initialize our app variable by setting it to the value of express()
const app = express();

// authentication middleware to work in teh context of a GraphQL API
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// home route for front end client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'));
})

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);




