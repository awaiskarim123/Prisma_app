const fp = require('fastify-plugin');

async function logger(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    fastify.log.info(`Incoming request: ${request.method} ${request.url}`);
  });

  fastify.addHook('onError', async (request, reply, error) => {
    fastify.log.error(`Error occurred on ${request.method} ${request.url}: ${error.message}`);
  });
}

module.exports = fp(logger);
