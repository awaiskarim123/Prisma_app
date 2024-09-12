const fastify = require('fastify')({ logger: true });
require('dotenv').config();

// Registering fastify-jwt plugin
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
});

// Registering plugins and middlewares
fastify.register(require('./plugins/logger'));
fastify.register(require('./middleware/errorHandler'));

// Defining the authenticate method
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Registering routes
fastify.register(require('./routes/register'));
fastify.register(require('./routes/login'));
fastify.register(require('./routes/refreshToken'));
fastify.register(require('./routes/protected'));
fastify.register(require('./routes/profile'));
fastify.register(require('./routes/getUser'));
fastify.register(require('./routes/emailVerification')); // New email verification route

// Registering fastify-multipart plugin
fastify.register(require('@fastify/multipart'));

// Starting the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
