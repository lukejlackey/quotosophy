import { Repository } from "redis-om";
import generateAPIKey from "../functions/apiKeys/generateAPIKey";
import { apiKeySchema } from "../models/apiKey.model";
const { redisClient, connect } = require("../config/redis.config")

export default async function createAPIKey(customerID) {
    await connect();

    const repo = new Repository(apiKeySchema, redisClient);

    //TODO: Prevent duplicate key generation

    const data = {
        apiKey: generateAPIKey(),
        customerID,
    }

    const newAPIKey = repo.createEntity(data);

    const id = await repo.save(newAPIKey);

    return id;
}