const { Entity, Schema } = require("redis-om")

class Customer extends Entity {}
export const customerSchema = new Schema(
    Customer,
    {
        stripeCustomerId: {type: 'string'},
        apiKey: {type: 'string'},
        active: {type: 'boolean'},
        itemId: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);