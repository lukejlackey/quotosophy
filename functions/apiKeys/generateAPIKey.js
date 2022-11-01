const { findAPIKey } = require("../../controllers/apiKey.controller")
const { randomBytes } = require('crypto');
const { hash } = require('../general/hash');

export default function generateAPIKey() {
    const apiKey = randomBytes(22).toString('hex');
    const hashedAPIKey = hash(apiKey);
    
    if (findAPIKey(hashedAPIKey)) {
        return generateAPIKey();
    };

    return { hashedAPIKey, apiKey };
}