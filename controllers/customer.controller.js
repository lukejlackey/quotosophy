import { Repository } from "redis-om";
import { customerSchema } from "../models/customer.model";
const { redisClient, connect } = require("../config/redis.config")

export default async function createCustomer(data) {
    await connect();

    const repo = new Repository(customerSchema, redisClient);

    const newCustomer = repo.createEntity(data);

    const id = await repo.save(newCustomer);
    
    return id;
}