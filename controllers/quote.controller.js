import keyToCustomer from "../functions/keyToCustomer.js";
import { getAllQuotes, getSingleQuote } from "../models/quote.model.js";
import { stripe } from "../models/stripe.model.js";

//GET
export async function quotesList(req, res) {
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
            const quotes = await getAllQuotes(page);
            if(quotes === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: quotes, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function quotesRandom(req, res) {
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
            const quote = await getSingleQuote();
            return res.status(200).send({data: quote, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};

//GET
export async function quotesId(req, res) {
    try {        
        const quoteId = parseInt(req.params['id']);
        if(!quoteId) {
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
            const quote = await getSingleQuote(quoteId);
            if(quote === null) {
                return res.sendStatus(404);
            }
            return res.status(200).send({data: quote, usage: record});
        };
    } catch (error) {
        return res.status(500).send(error);
    }
};