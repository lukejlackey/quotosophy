import { SQS } from "aws-sdk";
import { stripe } from "../models/stripe.model.js"

const sqs = new SQS();

export const produceMessage = async (itemId) => {
    let statusCode = 200;
    let message;
    console.log(itemId)
    if (!itemId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No body was found",
            }),
        };
    }

    try {
        await sqs
            .sendMessage({
                QueueUrl: process.env.QUEUE_URL,
                MessageBody: itemId,
                MessageAttributes: {
                    AttributeName: {
                        StringValue: "Attribute Value",
                        DataType: "String",
                    },
                },
            })
            .promise();
        message = "Message accepted!";
    } catch (error) {
        console.log(error);
        message = error;
        statusCode = 500;
    }

    return {
        statusCode,
        body: JSON.stringify({
            message,
        }),
    };
};

export const consumer = async (event) => {
    for (const record of event.Records) {
        const messageAttributes = record.messageAttributes;
        console.log("Message Attributes: ", messageAttributes.AttributeName.stringValue);
        console.log("Message Body: ", record.body);
        usage = await stripe.subscriptionItems.createUsageRecord(
            record.body,
            {
                quantity: 1,
                timestamp: 'now',
                action: 'increment',
            }
        );
        console.log("Usage: ", usage);
    }
};