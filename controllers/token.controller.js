import { tokenSchema } from "../models/token.model.js";
import client, { createIndex, openConnection } from "../config/redis.config.js";
import hash from "../functions/hash.js";
import { randomBytes } from "crypto";

createIndex(tokenSchema);

export async function createToken(customerId) {
    const token = randomBytes(32).toString("hex");
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    const newToken = repo.createEntity({
        customerId,
        token: hash(token),
    });
    const id = await repo.save(newToken);
    await client.execute(['EXPIRE', `Token:${id}`, 3600]);
    return token;
};

export async function findToken(token) {
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    const token = await repo.search()
        .where('token').equals(hash(token)).return.first();
    return token;
};