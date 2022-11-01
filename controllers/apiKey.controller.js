import { Repository } from "redis-om";
import { apiKeySchema } from "../models/apiKey.model";
const { redisClient, connect } = require("../config/redis.config")

async function createIndex() {
    await connect();

    const repo = new Repository(apiKeySchema, redisClient);
    await repo.createIndex();
}

createIndex();

export async function createAPIKey(customerID, apiKey) {
    await connect();

    const repo = new Repository(apiKeySchema, redisClient);

    const data = {
        apiKey,
        customerID,
    }

    const newAPIKey = repo.createEntity(data);

    const id = await repo.save(newAPIKey);

    return id;
}

export async function findAPIKey(apiKey) {
    await connect();

    const repo = new Repository(apiKeySchema, redisClient);

    const apiKey = await repo.search()
        .where('apiKey').eq(apiKey).return.first();
    
    return apiKey;
}

