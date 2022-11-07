import { customerSchema } from "../models/customer.model.js";
import { default as redisClient } from "../config/redis.config.js";

async function createIndex() {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(customerSchema);
    await repo.createIndex();
}

export async function createCustomer(data) {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(customerSchema);
    const newCustomer = repo.createEntity(data);
    const id = await repo.save(newCustomer);
    return id;
};

export async function findCustomerById(customerId) {
    const client = redisClient;
    await redisClient.open()
    const repo = client.fetchRepository(customerSchema);
    const customer = await repo.fetch(customerId);
    return customer;
};