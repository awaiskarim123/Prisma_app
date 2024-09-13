const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  // User updation route
  fastify.put('/updateUser', async (request, reply) => {
    const { id, email, password, username } = request.body;

    try {
      // Fetching the existing user by ID
      const existingUser = await prismaClient.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.status(404).send({ error: 'User not found. Please register first.' });
      }

      // Preparing the data object for the update
      const updatedData = {};

      // Checking if email, username, or password are provided and update accordingly
      if (email) {
        updatedData.email = email;
      }
      if (username) {
        updatedData.username = username;
      }
      if (password) {
        // Hashing the new password if provided
        updatedData.password = await bcrypt.hash(password, 10);
      }

      // Updating the user's details
      const updatedUser = await prismaClient.user.update({
        where: { id },
        data: updatedData,
      });

      reply.send({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      // Logging the error for debugging
      console.error('Error occurred:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
