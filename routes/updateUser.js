const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  // User update route
  fastify.put('/updateUser', async (request, reply) => {
    const { email, password, username } = request.body;

    try {
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return reply.status(404).send({ error: 'User not found. Please register first.' });
      }

      // Hash the new password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's details
      const updatedUser = await prismaClient.user.update({
        where: { email },
        data: {
          username,
          password: hashedPassword,
        },
      });

      reply.send({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      // Log the error for debugging
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
