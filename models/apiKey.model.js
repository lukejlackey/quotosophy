const { Entity, Schema } = require("redis-om")

class APIKey extends Entity {}
export const apiKeySchema = new Schema(
    APIKey,
    {
        apiKey: {type: 'string'},
        customerId: {type: 'number'},
    },
    {
        dataStructure: 'JSON',
    }
);