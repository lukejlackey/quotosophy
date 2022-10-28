const { Client } = require("redis-om")

export const redisClient = new Client();

export default async function connect() {
    if(!redisClient.isOpen()) {
        await redisClient.open(process.env.REDIS_URL);
    }
}