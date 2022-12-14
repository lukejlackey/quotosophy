import generateAPIKey from '../functions/generateAPIKey.js';
import { findAPIKey, updateAPIKey } from '../models/apiKey.model.js';
import { sendNewKeyRecovered, sendReset } from '../models/courier.model.js';
import { findCustomerByEmail, findCustomerById, updateCustomer } from '../models/customer.model.js';
import { deleteToken, findToken } from '../models/token.model.js';

//GET
export async function recover(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.CLIENT_API_KEY) {
            return res.sendStatus(400);
        }
        const email = req.headers['email'];
        if(!findCustomerByEmail(email)) {
            return res.sendStatus(404);
        }
        const requestId = await sendReset(email);
        return res.status(200).send({requestId});
    } catch (error) {
        return res.status(500).send(error);
    }
}

//PUT
export async function reset(req, res, next) {
    try {        
        const key = req.headers['x-api-key'];
        if (key !== process.env.CLIENT_API_KEY) {
            return res.sendStatus(400);
        }
        let { token, cid } = req.headers;
        token = await findToken(token);
        cid = cid.replace('-','_');
        if(!token) {
            return res.sendStatus(404);
        }
        if(token.customerId !== cid) {
            return res.sendStatus(400);
        }
        let customer = await findCustomerById(cid);
        if(!customer) {
            return res.sendStatus(404);
        }
        let apiKeyMapping = await findAPIKey(customer.apiKey);
        if(!apiKeyMapping) {
            return res.sendStatus(404);
        }
        const {hashedAPIKey, apiKey} = generateAPIKey();
        customer.apiKey = apiKeyMapping.apiKey = hashedAPIKey;
        const customerId = await updateCustomer(customer);
        const apiKeyId = await updateAPIKey(apiKeyMapping);
        await deleteToken(token.entityId);
        const requestId = await sendNewKeyRecovered(customer.email, apiKey);
        return res.status(200).send({requestId});
    } catch (error) {
        return res.status(500).send(error);
    }
}