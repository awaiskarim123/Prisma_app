const rbacMiddleware = require('../middleware/role');

module.exports = async function (fastify, options) {
  fastify.get('/protected', {
    preValidation: [fastify.authenticate, rbacMiddleware(['ADMIN'])], // Only admins can access this
  }, async (request, reply) => {
    reply.send({ message: 'This is a protected route, accessible only by admins.' });
  });
};
