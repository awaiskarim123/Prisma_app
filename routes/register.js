"use strict";

// routes/register.js
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = async function (fastify, options) {
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
};
