import { Entity, Schema } from "redis-om";
import client, { createIndex, openConnection } from "../config/redis.config.js";

class APIKey extends Entity {}
export const apiKeySchema = new Schema(
    APIKey,
    {
        apiKey: {type: 'string', textSearch: true},
        customerId: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);

createIndex(apiKeySchema);

export async function createAPIKey(customerId, apiKey) {
    await openConnection();
    const repo = client.fetchRepository(apiKeySchema);
    const data = {
        apiKey,
        customerId,
    }
    const newAPIKey = repo.createEntity(data);
    const id = await repo.save(newAPIKey);
    return id;
}

export async function updateAPIKey(apiKey) {
    await openConnection();
    const repo = client.fetchRepository(apiKeySchema);
    const id = await repo.save(apiKey);
    return id;
}

export async function findAPIKey(apiKey) {
    await openConnection();
    const repo = client.fetchRepository(apiKeySchema);
    const keyMapping = await repo.search()
        .where('apiKey').equals(apiKey).return.first();
    return keyMapping;
}
