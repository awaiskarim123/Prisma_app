const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.post('/refresh-token', async (request, reply) => {
    const { refreshToken } = request.body;

    try {
      console.log('Received Refresh Token:', refreshToken);

      const storedToken = await prismaClient.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        return reply.status(401).send({ error: 'Invalid refresh token' });
      }

      const decoded = fastify.jwt.verify(refreshToken);

      const newAccessToken = fastify.jwt.sign({ email: decoded.email }, { expiresIn: '15m' });

      reply.send({ success: true, accessToken: newAccessToken });
    } catch (error) {
      console.error('Error during token refresh:', error);
      reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });
};
