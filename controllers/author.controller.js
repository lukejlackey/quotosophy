import makeCall from "../functions/makeCall.js";
import { getAllAuthors, getSingleAuthor } from "../models/author.model.js";

//GET
export async function authorsList(req, res, next) {
    try { 
        const page = req.query['page'] ? parseInt(req.query['page']) : 1;
        const result = await makeCall(req, getAllAuthors, page);
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
export async function authorsRandom(req, res, next) {
    try { 
        const result = await makeCall(req, getSingleAuthor);
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
export async function authorsId(req, res, next) {
    try { 
        const authorId = parseInt(req.params['id']);
        const result = await makeCall(req, getSingleAuthor, authorId);
        if ('status' in result) {
            return res.sendStatus(result.status);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log({error})
        return res.status(500).send(error);
    };
};