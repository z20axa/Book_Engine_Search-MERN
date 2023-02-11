const { User } = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne ({
            _id: context.user._id
        }).select("-__V-password");
        return userData;
      }

      throw new AuthenticationError ("not logged in");
    },
},

Mutation: {
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken (user);

        return {user, token};
    },

    // log in

    // save book

    // remove book
},





module.exports = resolvers;
