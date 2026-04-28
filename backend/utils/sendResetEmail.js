const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
}

async function sendResetEmail(to, resetLink) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP configuration is missing');
    }

    const mailer = getTransporter();

    await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: 'Vextron AI | Reset your password',
        text: `You requested a password reset. Use this link within 15 minutes: ${resetLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
                <h2 style="margin-bottom: 8px;">Vextron AI</h2>
                <p style="margin-top: 0; color: #4b5563;">Password reset request</p>
                <p>You requested a password reset for your account.</p>
                <p>This link is valid for <strong>15 minutes</strong>.</p>
                <p style="margin: 24px 0;">
                    <a href="${resetLink}" style="background: #111827; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 6px;">
                        Reset Password
                    </a>
                </p>
                <p style="font-size: 13px; color: #6b7280; word-break: break-all;">
                    If the button does not work, use this link:<br />
                    <a href="${resetLink}">${resetLink}</a>
                </p>
                <p style="font-size: 13px; color: #6b7280;">If you did not request this, you can safely ignore this email.</p>
            </div>
        `,
    });
}

module.exports = {
    sendResetEmail,
};
