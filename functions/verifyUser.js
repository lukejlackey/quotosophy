import keyToCustomer from "./keyToCustomer.js";

export default async function verifyUser(req) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return {status: 400};
    };
    if (apiKey === process.env.CLIENT_API_KEY) {
        return {status: 200};
    }
    const customer = await keyToCustomer(apiKey);
    if (!customer || !customer.active) {
        return {status: 403};
    } else {
        return {status: 200, customer};
    }
}