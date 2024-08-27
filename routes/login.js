const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(400).send({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(400).send({ error: 'Invalid email or password' });
      }

      reply.send({ success: true, user });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
