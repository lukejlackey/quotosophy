import { connection } from "../config/redis.config.js";

export async function getAllQuotes() {
    const query = "MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) RETURN q.quoteId, q.quote , w.name , a.name";
    const reply = await connection.graph.QUERY('quotes', query);
    return reply.data;
}

export async function getSingleQuote(quoteId=null) {
    let query = "MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) ";
    if (quoteId === null) {
        query += "RETURN q.quoteId, q.quote , w.name , a.name ORDER BY rand() LIMIT 1";
    } else {
        query += `WHERE q.quoteId = ${quoteId} RETURN q.quoteId, q.quote , w.name , a.name LIMIT 1`;
    };
    let quote = await connection.graph.QUERY('quotes', query);
    if(quote.data.length > 0) {
        quote = quote.data[0];
        const reply = {
            id: quote[0],
            quote: quote[1],
            text: quote[2],
            author: quote[3]
        };
        return reply;
    }
    return null;
}