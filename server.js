const fastify = require('fastify')({ logger: true });
require('dotenv').config();

fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
});

fastify.register(require('./plugins/logger'));
fastify.register(require('./middleware/errorHandler'));

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Register routes
fastify.register(require('./routes/register'));
fastify.register(require('./routes/login'));
fastify.register(require('./routes/refreshToken'));
fastify.register(require('./routes/protected'));
fastify.register(require('./routes/profile'));
fastify.register(require('./routes/getUser'));
fastify.register(require('./routes/emailVerification')); // New email verification route
fastify.register(require('./routes/updateUser'));
fastify.register(require('./routes/userDelete')); // Register updated user delete route
fastify.register(require('./routes/deleteAllUsers')); // If applicable

// Register fastify-multipart plugin
fastify.register(require('@fastify/multipart'));

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
