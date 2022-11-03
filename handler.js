require('dotenv').config();
const serverless = require("serverless-http");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SK);
const { generateAPIKey } = require("./functions/apiKeys/generateAPIKey");
const { hashAPIKey } = require("./functions/general/hash");
const { createCustomer, findCustomerById } = require("./controllers/customer.controller");
const { createAPIKey, findAPIKey } = require("./controllers/apiKey.controller");

const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.get("/", async (req, res) => {
  const apiKey = req.headers['X-API-KEY'];
  if (!apiKey) {
    res.sendStatus(400);
  };
  const hashedAPIKey = hashAPIKey(apiKey);
  const customerId = findAPIKey(hashedAPIKey);
  const customer = findCustomerById(customerId);
  if (!customer || !customer.active) {
    res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
      //TODO: pull all quotes
      const quotes = []
      res.status(200).send({data: quotes, usage: record});
    };
});

  app.post("/checkout", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.PRICE_ID,
      },
    ],
    success_url: `${process.env.PUBLIC_IP}/success?session_id={CHECKOUT_SESSION}`,
    cancel_url: `${process.env.PUBLIC_IP}/error`,
  });

  return res.status(201).send(session);
});

app.get('/customers', (req, res) => {
  const customerId = req.params.id;
  const account = customers[customerId];
  if (account) {
    res.send(account);
  } else {
    res.sendStatus(404);
  }
});

app.post("/webhooks", async (req, res) => {
  let data;
  let eventType;
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if(webhookSecret) {
    
    let event;
    let signiture = req.headers['stripe-signature'];
    
    try {
      
      event = stripe.webhooks.constructEvent(
        req['rawBody'],
        signiture,
        webhookSecret
        );
        
      } catch (error) {
        
        console.error(`Webhook Error: ${err.message}`)
        return res.sendStatus(400);
        
      }
    
    data = event.data;
    eventType = event.type;
    
  } else {

    data = req.body.data;
    eventType = req.body.type;
    
  }
  
  switch(eventType) {
    case 'checkout.session.completed':
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;
      
      console.log(`Customer ${customerId} subscribed to plan ${subscriptionId}!`);
      
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;
      
      const { hashedAPIKey, apiKey } = generateAPIKey();
      
      const newCustomer = createCustomer({
        stripeCustomerId: customerId,
        apiKey: hashedAPIKey,
        active: true,
        itemId,
      });

      const newAPIKeyRecord = createAPIKey(newCustomer, hashedAPIKey);
      
      break;
      case 'invoice.paid':
        
        break;
        case 'invoice.payment_failed':
          
        default:
          console.log(`Unhandled event type ${eventType}`);
  }
  
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);