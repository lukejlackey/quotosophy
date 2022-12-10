import makeCall from "../functions/makeCall.js";
import { getAllSources, getSingleSource } from "../models/source.model.js";

//GET
export async function sourcesList(req, res, next) {
    try { 
        const page = req.query['page'] ? parseInt(req.query['page']) : 1;
        const result = await makeCall(req, getAllSources, page);
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
export async function sourcesRandom(req, res, next) {
    try { 
        const result = await makeCall(req, getSingleSource);
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
export async function sourcesId(req, res, next) {
    try { 
        const sourceId = parseInt(req.params['id']);
        const result = await makeCall(req, getSingleSource, sourceId);
        if ('status' in result) {
            return res.sendStatus(result.status);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log({error})
        return res.status(500).send(error);
    };
};