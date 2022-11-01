const { createHash } = require('crypto');
export function hash(data) {
    const hashed = createHash('SHA-256').update(data).digest('hex');
    return hashed;
}