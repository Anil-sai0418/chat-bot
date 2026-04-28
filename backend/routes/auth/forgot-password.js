const express = require('express');
const db = require('../../db');
const { sendResetEmail } = require('../../utils/sendResetEmail');
const {
    generateResetToken,
    hashResetToken,
    getResetTokenExpiryDate,
} = require('../../utils/passwordReset');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    }

    try {
        const userResult = await db.query('SELECT id, email FROM users WHERE email = $1', [email]);

        if (userResult.rows.length > 0) {
            const rawToken = generateResetToken();
            const hashedToken = hashResetToken(rawToken);
            const tokenExpiry = getResetTokenExpiryDate();

            await db.query(
                'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
                [hashedToken, tokenExpiry, userResult.rows[0].id]
            );

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;
            await sendResetEmail(userResult.rows[0].email, resetLink);
        }

        return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    }
});

module.exports = router;
