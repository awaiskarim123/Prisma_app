// server.js
const fastify = require('fastify')({ logger: true });
fastify.register(require('@fastify/formbody'));

// Register routes
fastify.register(require('./routes/register'));

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
