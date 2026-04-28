const crypto = require('crypto');

const RESET_TOKEN_EXPIRY_MINUTES = 15;

function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

function hashResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function getResetTokenExpiryDate() {
    const expiryMs = RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000;
    return new Date(Date.now() + expiryMs);
}

module.exports = {
    RESET_TOKEN_EXPIRY_MINUTES,
    generateResetToken,
    hashResetToken,
    getResetTokenExpiryDate,
};
