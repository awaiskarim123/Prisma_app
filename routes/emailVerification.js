const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const nodemailer = require('nodemailer');

module.exports = async function (fastify, options) {
    fastify.post('/send-verification-email', async (request, reply) => {
        const { email } = request.body;
        try {
            const user = await prismaClient.user.findUnique({ where: { email } });

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Generate a token
            const token = fastify.jwt.sign({ email: user.email }, { expiresIn: '1h' });

            // Send email (using nodemailer)
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Use TLS
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // Use the app-specific password if 2FA is enabled
                },
            });
            

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Email Verification',
                text: `Please verify your email by clicking the following link:`,
            };

            await transporter.sendMail(mailOptions);

            reply.send({ success: true, message: 'Verification email sent' });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.get('/verify-email', async (request, reply) => {
        const { token } = request.query;

        try {
            const decoded = fastify.jwt.verify(token);
            const user = await prismaClient.user.update({
                where: { email: decoded.email },
                data: { emailVerified: true },
            });

            reply.send({ success: true, message: 'Email verified', user });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Invalid or expired token' });
        }
    });
};
