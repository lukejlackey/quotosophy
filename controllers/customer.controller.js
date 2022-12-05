import { customerSchema } from "../models/customer.model.js";
import client, { createIndex, openConnection } from "../config/redis.config.js";

createIndex(customerSchema);

export async function createCustomer(data) {
    await openConnection();
    const repo = client.fetchRepository(customerSchema);
    const newCustomer = repo.createEntity(data);
    const id = await repo.save(newCustomer);
    return id;
};

export async function updateCustomer(customer) {
    await openConnection();
    const repo = client.fetchRepository(customerSchema);
    const id = await repo.save(customer);
    return id;
};

export async function findCustomerById(customerId) {
    await openConnection();
    const repo = client.fetchRepository(customerSchema);
    const customer = await repo.search()
    .where('stripeCustomerId').equals(customerId).return.first();
    return customer;
};

export async function cancelCustomerById(customerId) {
    await openConnection();
    const repo = client.fetchRepository(customerSchema);
    let customer = await repo.search()
    .where('stripeCustomerId').equals(customerId).return.first();
    customer['active'] = false;
    const id = await repo.save(customer);
    return id;
};

export async function findCustomerByEmail(email) {
    await openConnection();
    const repo = client.fetchRepository(customerSchema);
    const customer = await repo.search()
        .where('email').equals(email).return.first();
    return customer;
};