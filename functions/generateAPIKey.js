import { randomBytes } from "crypto";
import { findAPIKey } from "../controllers/apiKey.controller.js";
import hash from "./hash.js";

export default function generateAPIKey() {
    let apiKey = randomBytes(16).toString('hex');
    const hashedAPIKey = hash(apiKey);
    if (findAPIKey(hashedAPIKey).length > 0) {
        return generateAPIKey();
    };

    return { hashedAPIKey, apiKey };
}