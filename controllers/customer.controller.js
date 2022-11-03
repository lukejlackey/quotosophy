import { Repository } from "redis-om";
import { customerSchema } from "../models/customer.model";
const { redisClient, connection } = require("../config/redis.config")

async function createIndex() {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(customerSchema, client);
    await repo.createIndex();
}

export async function createCustomer(data) {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(customerSchema, client);
    const newCustomer = repo.createEntity(data);
    const id = await repo.save(newCustomer);
    return id;
};

export async function findCustomerById(customerId) {
    await connection.connect();
    const client = redisClient;
    const repo = new Repository(customerSchema, client);
    const customer = await repo.fetch(customerId);
    return customer;
};