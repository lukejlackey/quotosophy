import { createHash } from 'crypto';

export default function hash(data) {
    const hashed = createHash('sha256').update(data).digest('hex');
    return hashed;
}