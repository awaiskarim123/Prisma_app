const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  // Get user by email or username
  fastify.get('/user', async (request, reply) => {
    const { email, username } = request.query; // Use request.query instead of request.body

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { username: username || undefined },
          ],
        },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      reply.send({ success: true, user });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE user by email or username
  fastify.delete('/user', {
    preValidation: [fastify.authenticate], // Protect the route with authentication
  }, async (request, reply) => {
    const { email, username } = request.body;
  
    if (!email && !username) {
      return reply.status(400).send({ error: 'Email or username is required' });
    }
  
    try {
      // Find the user by email or username
      const user = await prismaClient.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });
  
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }
  
      // Delete the user
      await prismaClient.user.delete({
        where: { id: user.id }
      });
  
      return reply.status(200).send({ message: 'User deleted successfully' });
  
    } catch (error) {
      console.log(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};
