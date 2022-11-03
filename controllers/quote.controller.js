const {connection} = require("../config/redis.config");

export async function getAllQuotes() {
    await connection.connect();
    const query = "MATCH (a:Author)-[r:WROTE]->(w:Work)-[c:CONTAINS]->(q:Quote) RETURN r, c";
    const reply = await connection.graph('quotes').query(query);
}