const AWS = require("aws-sdk");
const stripe = require("stripe");
const express = require("express");
const serverless = require("serverless-http");
const { hashAPIKey } = require("./functions/apiKeys/hashAPIKey");

const app = express();

const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

async function getItem(params, response) {
  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      return Item
    } else {
      response
        .status(404)
        .json({ error: 'Could not find item with provided parameters' });
        return false;
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error: "Could not retreive item" });
    return false;
  }
}

app.get("/quotes", async function (req, res) {

  const apiKeyParams = {
    TableName: APIKEYS_TABLE,
    Key: {
      "apiKey": hashAPIKey(req.headers['X-API-KEY']),
    },
  };

  const Item = await getItem(apiKeyParams, res)

  if (Item) {

    const customerParams = {
      TableName: CUSTOMERS_TABLE,
      Key: {
        "customerId": Item.customerId,
      },
    };

    const Customer = await getItem(customerParams, res)

    if (Customer && Customer.active) {
      const usageRecord = await stripe.subscriptionItems.createUsageRecord(
        Customer.itemID,
        {
          quantity: 1,
          timestamp: 'now',
          action: 'increment',
        }
      );
      res.send()
    }
  }

});

app.post("/customers", async function (req, res) {
  const { customerId, stripeCustomerId } = req.body;
  if (typeof customerId !== "string") {
    res.status(400).json({ error: '"customerId" must be a string' });
  } else if (typeof stripeCustomerId !== "object") {
    res.status(400).json({ error: '"stripeCustomerId" must be an object' });
  }

  const params = {
    TableName: CUSTOMERS_TABLE,
    Item: {
      customerId: customerId,
      stripeCustomerId: stripeCustomerId,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ customerId, stripeCustomerId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create customer" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
