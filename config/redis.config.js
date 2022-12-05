import { Client } from "redis-om";
import { createClient } from 'redis';

export const url = process.env.REDIS_URL;

export const connection = createClient({ url });
connection.on('error', (err) => console.log('Redis Client Error', err));
await connection.connect();

const client = await new Client().use(connection);

export async function openConnection() {
    if (!client.isOpen()) {
        await client.open(url);
    }
}

export async function createIndex(schema) {
    await client.open();
    const repo = client.fetchRepository(schema);
    await repo.createIndex();
}

export default client;