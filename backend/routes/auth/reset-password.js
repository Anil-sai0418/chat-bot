const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const { hashResetToken } = require('../../utils/passwordReset');

const router = express.Router();

router.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        const hashedToken = hashResetToken(token);
        const userResult = await db.query(
            `SELECT id FROM users
             WHERE reset_token = $1
             AND reset_token_expiry IS NOT NULL
             AND reset_token_expiry > NOW()
             LIMIT 1`,
            [hashedToken]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await db.query(
            `UPDATE users
             SET password = $1,
                 reset_token = NULL,
                 reset_token_expiry = NULL,
                 updated_at = NOW()
             WHERE id = $2`,
            [passwordHash, userResult.rows[0].id]
        );

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
