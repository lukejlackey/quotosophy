import { Entity, Schema } from "redis-om";
import client, { createIndex, openConnection } from "../config/redis.config.js";
import hash from "../functions/hash.js";
import { randomBytes } from "crypto";

class Token extends Entity {}
export const tokenSchema = new Schema(
    Token,
    {
        customerId: {type: 'string'},
        token: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);

createIndex(tokenSchema);

export async function findToken(unhashedToken) {
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    const token = await repo.search()
        .where('token').equals(hash(unhashedToken)).return.first();
    return token;
};

export async function findTokenByCustomer(customerId) {
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    const token = await repo.search()
        .where('customerId').equals(customerId).return.first();
    return token;
};

export async function createToken(customerId) {
    const token = randomBytes(32).toString("hex");
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    const oldToken = await findTokenByCustomer(customerId);
    if(oldToken) {
        await deleteToken(oldToken.entityId);
    }
    const newToken = repo.createEntity({
        customerId: customerId,
        token: hash(token),
    });
    const id = await repo.save(newToken);
    await client.execute(['EXPIRE', `Token:${id}`, 3600]);
    return token;
};

export async function deleteToken(id) {
    await openConnection();
    const repo = client.fetchRepository(tokenSchema);
    return await repo.remove(id);
};
