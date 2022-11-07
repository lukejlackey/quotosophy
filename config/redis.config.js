import { Client } from "redis-om";
import { createClient } from "redis";

export const url = "redis://default:Sb6hZg5NNptiRktWg4mhxlTLvp4AYuJl@redis-11669.c270.us-east-1-3.ec2.cloud.redislabs.com:11669";

export const connection = createClient({ url });
await connection.connect();

export const redisClient = await new Client().use(connection);

export default redisClient;