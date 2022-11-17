import { Graph } from 'redis';
import { connection } from "../config/redis.config.js";

export async function getAllQuotes(page=1) {
    const floor = (page - 1) * 10;
    const graph = new Graph(connection, 'quotes');
    const reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE q.quoteId > $floor RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry ORDER BY q.quoteId LIMIT $limit",
        {
            params: {
                limit: 10,
                floor
            }
        }
    );
    return reply.data.length > 0 ? reply.data : null;
}

export async function getSingleQuote(quoteId=null) {
    const graph = new Graph(connection, 'quotes');
    let reply;
    if (quoteId === null) {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry ORDER BY rand() LIMIT $limit",
            {
                params: {
                    limit: 1
                }
            }
        );
    } else {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE q.quoteId = $inputId RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry LIMIT $limit",
            {
                params: {
                    limit: 1,
                    inputId: quoteId,
                }
            }
        );
    };
    return reply.data.length > 0 ? reply.data[0].entry : null;
}