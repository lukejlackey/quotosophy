const { Entity, Schema } = require("redis-om")

class APIKey extends Entity {}
export const apiKeySchema = new Schema(
    APIKey,
    {
        apiKey: {type: 'string', textSearch: true},
        customerId: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);