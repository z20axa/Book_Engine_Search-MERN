const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: String
    savedBooks: [books]!
  }

  type Book {
    _id: ID
    authors: String
    description: String
    tittle: String
    image: 
    link:
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    // save book
    // remove book
  }
`;

module.exports = typeDefs;