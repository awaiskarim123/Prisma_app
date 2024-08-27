const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  fastify.post('/register', async (request, reply) => {
    const { email, password, username } = request.body;

    try {
      // Hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          username
        },
      });

      reply.send({ success: true, user });
    } catch (error) {
      console.error(error); // Loging the exact error
      if (error.code === 'P2002') {
        reply.status(400).send({ error: 'Email or Username already exists' });
      } else {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }    
  });
};
