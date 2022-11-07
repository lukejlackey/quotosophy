import { findAPIKey } from "../../controllers/apiKey.controller.js";
import { randomBytes } from "crypto";
import {default as hash} from "../general/hash.js";

export default function generateAPIKey() {
    let apiKey = randomBytes(16).toString('hex');
    const hashedAPIKey = hash(apiKey);
    if (findAPIKey(hashedAPIKey).length > 0) {
        return generateAPIKey();
    };

    return { hashedAPIKey };
}