const { Entity, Schema } = require("redis-om")

class Customer extends Entity {}
export const customerSchema = new Schema(
    Customer,
    {
        active: {type: 'boolean'},
        itemId: {type: 'string'},
        calls: {type: 'number'},
    },
    {
        dataStructure: 'JSON',
    }
);