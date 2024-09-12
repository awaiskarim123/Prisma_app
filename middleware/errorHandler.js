const fp = require('fastify-plugin');

async function errorHandler(fastify, options) {
  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      reply.status(400).send({ error: 'Bad Request', details: error.validation });
    } else {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = fp(errorHandler);
