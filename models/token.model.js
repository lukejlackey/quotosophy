import { Entity, Schema } from "redis-om";

class Token extends Entity {}
export const tokenSchema = new Schema(
    Token,
    {
        customerId: {type: 'string'},
        token: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);