import { Graph } from 'redis';
import { connection } from "../config/redis.config.js";

export async function getAllSources(page=1) {
    const floor = (page - 1) * 10;
    const graph = new Graph(connection, 'quotes');
    const reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE w.workId > $floor WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry ORDER BY w.workId LIMIT $limit",
        {
            params: {
                limit: 10,
                floor
            }
        }
    );
    return reply.data.length > 0 ? reply.data : null;
}

export async function getSingleSource(sourceId=null) {
    const graph = new Graph(connection, 'quotes');
    let reply;
    if (sourceId === null) {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry ORDER BY rand() LIMIT $limit",
            {
                params: {
                    limit: 1
                }
            }
        );
    } else {
        reply = await graph.roQuery("MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) WHERE w.workId = $inputId WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry LIMIT $limit",
            {
                params: {
                    limit: 1,
                    inputId: sourceId,
                }
            }
        );
    };
    return reply.data.length > 0 ? reply.data[0].entry : null;
}