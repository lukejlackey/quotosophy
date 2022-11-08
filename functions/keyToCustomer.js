import { findAPIKey } from "../controllers/apiKey.controller.js";
import { findCustomerById } from "../controllers/customer.controller.js";
import hash from "./hash.js";

export default async function keyToCustomer(apiKey) {
    const hashedAPIKey = hash(apiKey);
    const apiKeyMapping = await findAPIKey(hashedAPIKey);
    if(!apiKeyMapping) return null;
    const customer = await findCustomerById(apiKeyMapping['customerId']);
    return customer;
}