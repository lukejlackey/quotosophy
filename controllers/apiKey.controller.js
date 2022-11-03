import { Repository } from "redis-om";
import { apiKeySchema } from "../models/apiKey.model";
const { redisClient, connection} = require("../config/redis.config")

async function createIndex() {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(apiKeySchema, client);
    await repo.createIndex();
}

createIndex();

export async function createAPIKey(customerID, apiKey) {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(apiKeySchema, client);

    const data = {
        apiKey,
        customerID,
    }

    const newAPIKey = repo.createEntity(data);

    const id = await repo.save(newAPIKey);

    return id;
}

export async function findAPIKey(apiKey) {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(apiKeySchema, client);

    const apiKey = await repo.search()
        .where('apiKey').eq(apiKey).return.first();
    
    return apiKey;
}

