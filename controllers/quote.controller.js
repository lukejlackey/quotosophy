import makeCall from "../functions/makeCall.js";
import { getAllQuotes, getSingleQuote } from "../models/quote.model.js";

//GET
export async function quotesList(req, res, next) {
    try { 
        const page = req.query['page'] ? parseInt(req.query['page']) : 1;
        const result = await makeCall(req, getAllQuotes, page);
        if ('status' in result) {
            return res.sendStatus(result.status);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log({error})
        return res.status(500).send(error);
    };
};

//GET
export async function quotesRandom(req, res, next) {
    try { 
        const result = await makeCall(req, getSingleQuote);
        if ('status' in result) {
            return res.sendStatus(result.status);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log({error})
        return res.status(500).send(error);
    };
};

//GET
export async function quotesId(req, res, next) {
    try { 
        const quoteId = parseInt(req.params['id']);
        const result = await makeCall(req, getSingleQuote, quoteId);
        if ('status' in result) {
            return res.sendStatus(result.status);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log({error})
        return res.status(500).send(error);
    };
};