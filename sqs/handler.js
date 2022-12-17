import { SQS } from "aws-sdk";

const sqs = new SQS();

const producer = async (event) => {
    let statusCode = 200;
    let message;

    if (!event.body) {
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
                MessageBody: event.body,
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

const consumer = async (event) => {
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

module.exports = {
    producer,
    consumer,
};