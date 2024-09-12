const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.get('/profile', {
    preValidation: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email: request.user.email },
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
};
