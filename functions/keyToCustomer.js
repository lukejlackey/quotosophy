import { findAPIKey } from "../models/apiKey.model.js";
import { findCustomerById } from "../models/customer.model.js";
import hash from "./hash.js";

export default async function keyToCustomer(apiKey) {
    const hashedAPIKey = hash(apiKey);
    const apiKeyMapping = await findAPIKey(hashedAPIKey);
    if(!apiKeyMapping) return null;
    const customer = await findCustomerById(apiKeyMapping['customerId']);
    return customer;
}