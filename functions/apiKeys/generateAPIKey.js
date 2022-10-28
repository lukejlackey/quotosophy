export default function generateAPIKey() {
    const { randomBytes } = require('crypto');
    const { hashAPIKey } = require('./hashAPIKey');

    const apiKey = randomBytes(22).toString('hex');
    const hashAPIKey = hashAPIKey(apiKey);
    
    return { hashAPIKey, apiKey };
}