const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.delete('/deleteUser/:id', {
    preValidation: [fastify.authenticate], // Protecting the route with authentication
  }, async (request, reply) => {
    const userId = parseInt(request.params.id, 10);

    if (isNaN(userId)) {
      return reply.status(400).send({ error: 'Invalid user ID' });
    }

    try {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Deleting the user by ID
      await prismaClient.user.delete({
        where: { id: userId },
      });

      reply.send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
