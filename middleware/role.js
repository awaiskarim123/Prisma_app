module.exports = function (roles = []) {
  return async function (request, reply) {
    const user = request.user;

    if (!roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Forbidden: You do not have access to this resource.' });
    }
  };
};
