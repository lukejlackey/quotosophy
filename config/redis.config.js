import { Client } from "redis-om";
import { createClient } from "redis";

export const url = "redis://default:Sb6hZg5NNptiRktWg4mhxlTLvp4AYuJl@redis-11669.c270.us-east-1-3.ec2.cloud.redislabs.com:11669";

export const connection = createClient({ url });
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