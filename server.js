const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

fastify.register(require('@fastify/formbody'));

// Registration route
fastify.post('/register', async (request, reply) => {
    const { email, password, username } = request.body;
  
    try {
      const user = await prismaClient.user.create({
        data: {
          email,
          password, 
          username
        },
      });
  
      reply.send({ success: true, user });
    } catch (error) {
      if (error.code === 'P2002') {
        reply.status(400).send({ error: 'Email already exists' });
      } else {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  });
  

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
