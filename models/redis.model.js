import { Graph } from 'redis';
import { connection } from "../config/redis.config.js";

export function constructQuotesQuery(uniqueString) {
    const start = "MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) ";
    return start + uniqueString;
}

export async function getAllItems(query, page=1, graphName='quotes') {
    if (graphName === 'quotes') {
        query = constructQuotesQuery(query);
    };
    const floor = (page - 1) * 10;
    const graph = new Graph(connection, graphName);
    const reply = await graph.roQuery(query,
        {
            params: {
                limit: 10,
                floor
            }
        }
    );
    return reply.data.length > 0 ? {page, data: reply.data} : null;
}

export async function getSingleItem(singleQuery, randomQuery, itemId=null, graphName='quotes') {
    if (graphName === 'quotes') {
        singleQuery = constructQuotesQuery(singleQuery);
        randomQuery = constructQuotesQuery(randomQuery);
    };
    const graph = new Graph(connection, graphName);
    let reply;
    if (itemId === null) {
        reply = await graph.roQuery(randomQuery,
            {
                params: {
                    limit: 1
                }
            }
        );
    } else {
        reply = await graph.roQuery(singleQuery,
            {
                params: {
                    limit: 1,
                    inputId: itemId,
                }
            }
        );
    };
    return reply.data.length > 0 ? reply.data[0].entry : null;
}

export async function getRandomItem() {
    return await getSingleItem();
}