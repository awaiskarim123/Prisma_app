const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    try {
      const lowerCaseEmail = email.toLowerCase();
      const user = await prismaClient.user.findFirst({
        where: { email: lowerCaseEmail },
      });

      if (!user) {
        return reply.status(400).send({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(400).send({ error: 'Invalid email or password' });
      }

      const accessToken = fastify.jwt.sign({ email: user.email }, { expiresIn: '1d' });
      const refreshToken = fastify.jwt.sign({ email: user.email }, { expiresIn: '7d' });

      console.log('Generated Access Token:', accessToken);
      console.log('Generated Refresh Token:', refreshToken);

      await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
        },
      });

      reply.send({ success: true, accessToken, refreshToken, user });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
