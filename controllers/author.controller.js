import keyToCustomer from "../functions/keyToCustomer.js";
import { getAllAuthors, getSingleAuthor } from "../models/author.model.js";
import { stripe } from "../models/stripe.model.js";

//GET
export async function authorsList(req, res) {
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
            const authors = await getAllAuthors(page);
            if(authors === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: authors, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function authorsRandom(req, res) {
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
            const author = await getSingleAuthor();
            if(author === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: author, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function authorsId(req, res) {
    try {        
        const authorId = parseInt(req.params['id']);
        if(!authorId) {
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
            const author = await getSingleAuthor(authorId);
            if(author === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: author, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};