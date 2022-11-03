const { Client } = require("redis-om")
const { createClient } = require('redis');

export const url = process.env.REDIS_URL;

export const connection = createClient({ url });
await connection.connect()

const redisClient = await new Client().use(connection);

export default redisClient;