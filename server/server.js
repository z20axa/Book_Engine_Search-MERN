const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { authMiddleware } = require('./utils/auth');

const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

const startServer = async() => {
  await server.start();
  app.use('/graphql', cors(), expressMiddleware(server));
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}


startServer();
