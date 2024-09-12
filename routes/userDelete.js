const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.delete('/deleteUser', async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Validating the provided password with the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(400).send({ error: 'Invalid password' });
      }

      // Deleting the user
      await prismaClient.user.delete({
        where: { email },
      });

      reply.send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
