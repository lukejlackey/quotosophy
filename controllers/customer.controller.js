import { Repository } from "redis-om";
import { customerSchema } from "../models/customer.model";
const { redisClient, connect } = require("../config/redis.config")

async function createIndex() {
    await connect();

    const repo = new Repository(customerSchema, redisClient);
    await repo.createIndex();
}

export async function createCustomer(data) {
    await connect();
    const repo = new Repository(customerSchema, redisClient);
    const newCustomer = repo.createEntity(data);
    const id = await repo.save(newCustomer);
    return id;
};

export async function findCustomerById(customerId) {
    await connect();
    const repo = new Repository(customerSchema, redisClient);
    const customer = await repo.fetch(customerId);
    return customer;
};