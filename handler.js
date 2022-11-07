import { config } from 'dotenv';
config();
import serverless from "serverless-http";
import express, { json } from "express";
import Stripe from 'stripe';
import { default as generateAPIKey } from "./functions/apiKeys/generateAPIKey.js";
import { default as hash } from "./functions/general/hash.js";
import { createCustomer, findCustomerById } from "./controllers/customer.controller.js";
import { createAPIKey, findAPIKey } from "./controllers/apiKey.controller.js";

const stripe = new Stripe(process.env.STRIPE_SK);

const app = express();

app.use(
  json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.get("/test", async (req, res) => {
  const customerId = findAPIKey("fJeiBDTzGN2pRejaITaJj6WcEJs");
  const customer = findCustomerById(customerId);
  res.send({data: {customerId, customer}});
});

app.get("/", async (req, res) => {
  let apiKey = req.headers['X-API-KEY'];
  if (!apiKey) {
    res.sendStatus(400);
  };
  const hashedAPIKey = hash(apiKey);
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
  res.status(201).send(session);
});

app.get('/customers', (req, res) => {
  const customerId = req.params.id;
  if (customerId) {
    res.send(customerId);
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
      console.error(data);
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;
      
      console.log(`Customer ${customerId} subscribed to plan ${subscriptionId}!`);
      
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;
      
      const { hashedAPIKey } = generateAPIKey();
      
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

export const handler = serverless(app);