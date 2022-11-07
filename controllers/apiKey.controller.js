import { apiKeySchema } from "../models/apiKey.model.js";
import { default as redisClient } from "../config/redis.config.js";

async function createIndex() {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(apiKeySchema);
    await repo.createIndex();
}

createIndex();

export async function createAPIKey(customerID, apiKey) {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(apiKeySchema);

    const data = {
        apiKey,
        customerID,
    }

    const newAPIKey = repo.createEntity(data);

    const id = await repo.save(newAPIKey);

    return id;
}

export async function findAPIKey(apiKey) {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(apiKeySchema);
    const key = await repo.search()
        .where('apiKey').eq(apiKey).return.first();
    
    return key;
}

