export default function HashAPIKey(apiKey) {
    const { createHash } = require('crypto');
    const hashedAPIKey = createHash('SHA-256').update(apiKey).digest('hex');
    return hashedAPIKey;
}