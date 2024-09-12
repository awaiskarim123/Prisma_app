const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.delete('/deleteAll', async (request, reply) => {
    try {
      // Delete all users
      await prismaClient.user.deleteMany();

      reply.send({ success: true, message: 'All users deleted successfully' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
