const fastify = require('fastify')({ logger: true });
fastify.register(require('@fastify/multipart'));

// Registering routes
fastify.register(require('./routes/register'));
fastify.register(require('./routes/login')); // Registering the login route

// Starting the server
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
