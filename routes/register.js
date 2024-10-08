const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
  // User registration route
  fastify.post('/register', async (request, reply) => {
    const { email, password, username } = request.body;

    try {
      // Check if the user already exists by email
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists. Consider updating instead.' });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          emailVerified: false,  // Default to email not verified
        },
      });

      reply.send({ success: true, message: 'User registered successfully', user });
    } catch (error) {
      // Log the error for debugging
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
