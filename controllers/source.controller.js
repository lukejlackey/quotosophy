import keyToCustomer from "../functions/keyToCustomer.js";
import { getAllSources, getSingleSource } from "../models/source.model.js";
import { stripe } from "../models/stripe.model.js";

//GET
export async function sourcesList(req, res) {
    try {        
        const page = req.query['page'] ? parseInt(req.query['page']) : 1;
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.sendStatus(400);
        };
        const customer = await keyToCustomer(apiKey);
        if (!customer || !customer.active) {
            return res.sendStatus(403);
        } else {
            const record = await stripe.subscriptionItems.createUsageRecord(
                customer.itemId,
                {
                    quantity: 1,
                    timestamp: 'now',
                    action: 'increment',
                }
            );
            const sources = await getAllSources(page);
            if(sources === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: sources, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function sourcesRandom(req, res) {
    try {        
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.sendStatus(400);
        };
        const customer = await keyToCustomer(apiKey);
        if (!customer || !customer.active) {
                return res.sendStatus(403);
        } else {
            const record = await stripe.subscriptionItems.createUsageRecord(
                customer.itemId,
                {
                    quantity: 1,
                    timestamp: 'now',
                    action: 'increment',
                }
            );
            const source = await getSingleSource();
            if(source === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: source, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function sourcesId(req, res) {
    try {        
        const sourceId = parseInt(req.params['id']);
        if(!sourceId) {
            return res.sendStatus(404);
        }
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.sendStatus(400);
        };
        const customer = await keyToCustomer(apiKey);
        if (!customer || !customer.active) {
            return res.sendStatus(403);
        } else {
            const record = await stripe.subscriptionItems.createUsageRecord(
                customer.itemId,
                {
                    quantity: 1,
                    timestamp: 'now',
                    action: 'increment',
                }
            );
            const source = await getSingleSource(sourceId);
            if(source === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: source, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};