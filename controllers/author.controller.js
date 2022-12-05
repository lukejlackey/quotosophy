import { Graph } from 'redis';
import { connection } from "../config/redis.config.js";

export async function getAllAuthors(page=1) {
    const floor = (page - 1) * 10;
    const graph = new Graph(connection, 'quotes');
    const reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE w.workId > $floor WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry ORDER BY a.authorId LIMIT $limit",
        {
            params: {
                limit: 10,
                floor
            }
        }
    );
    return reply.data.length > 0 ? {page, authors: reply.data} : null;
}

export async function getSingleAuthor(authorId=null) {
    const graph = new Graph(connection, 'quotes');
    let reply;
    if (authorId === null) {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry ORDER BY rand() LIMIT $limit",
            {
                params: {
                    limit: 1
                }
            }
        );
    } else {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE a.authorId = $inputId WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry LIMIT $limit",
            {
                params: {
                    limit: 1,
                    inputId: authorId,
                }
            }
        );
    };
    return reply.data.length > 0 ? reply.data[0].entry : null;
}

export async function getRandomAuthor() {
    return await getSingleAuthor();
}