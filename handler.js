import { config } from 'dotenv';
config();
import serverless from "serverless-http";
import express, { json } from "express";
import Stripe from 'stripe';
import generateAPIKey from "./functions/generateAPIKey.js";
import keyToCustomer from './functions/keyToCustomer.js';
import { createCustomer } from "./controllers/customer.controller.js";
import { createAPIKey } from "./controllers/apiKey.controller.js";
import { getAllQuotes, getSingleQuote } from "./controllers/quote.controller.js";
import { getAllSources, getSingleSource } from "./controllers/source.controller.js";

const stripe = new Stripe(process.env.STRIPE_SK);

const app = express();

app.use(
  json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.get("/", async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
      const quotes = await getRandomQuote();
      return res.status(200).send({data: quotes, usage: record});
    };
  });
  
app.get("/quotes/all", async (req, res) => {
  const page = req.query['page'] ? parseInt(req.query['page']) : 1;
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const quotes = await getAllQuotes(page);
    if(quotes === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: quotes, usage: record});
    };
});

app.get("/quotes/random", async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const quote = await getSingleQuote();
    return res.status(200).send({data: quote, usage: record});
    };
});

app.get("/quotes/:id", async (req, res) => {
  const quoteId = parseInt(req.params['id']);
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const quote = await getSingleQuote(quoteId);
    if(quote === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: quote, usage: record});
    };
});

app.get("/sources/all", async (req, res) => {
  const page = req.query['page'] ? parseInt(req.query['page']) : 1;
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const sources = await getAllSources(page);
    if(sources === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: sources, usage: record});
    };
});

app.get("/sources/random", async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const source = await getSingleSource();
    if(source === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: source, usage: record});
    };
});

app.get("/sources/:id", async (req, res) => {
  const sourceId = parseInt(req.params['id']);
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.sendStatus(400);
  };
  const customer = await keyToCustomer(apiKey);
  if (!customer || !customer.active) {
    return res.sendStatus(403);
  } else {
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
      );
    const source = await getSingleSource(sourceId);
    if(source === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: source, usage: record});
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

app.get('/customers/:id', (req, res) => {
  const customerId = req.params.id;
  if (customerId) {
    return res.send(customerId);
  } else {
    return res.sendStatus(404);
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
      
      const { hashedAPIKey, apiKey } = generateAPIKey();

      console.log({apiKey});
      
      const newCustomer = createCustomer({
        stripeCustomerId: customerId,
        apiKey: hashedAPIKey,
        active: true,
        itemId,
      });

      const newAPIKeyRecord = createAPIKey(customerId, hashedAPIKey);
      
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