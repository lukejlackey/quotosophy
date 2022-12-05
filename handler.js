import { config } from 'dotenv';
config();
import serverless from "serverless-http";
import express, { json } from "express";
import Stripe from 'stripe';
import generateAPIKey from "./functions/generateAPIKey.js";
import keyToCustomer from './functions/keyToCustomer.js';
import { createCustomer, findCustomerByEmail, findCustomerById, updateCustomer } from "./controllers/customer.controller.js";
import { createAPIKey, findAPIKey, updateAPIKey } from "./controllers/apiKey.controller.js";
import { getAllQuotes, getSingleQuote, getRandomQuote } from "./controllers/quote.controller.js";
import { getAllSources, getSingleSource, getRandomSource } from "./controllers/source.controller.js";
import { getAllAuthors, getSingleAuthor, getRandomAuthor } from "./controllers/author.controller.js";
import { sendNewKey, sendNewKeyRecovered, sendReset } from './models/courier.model.js';
import { deleteToken, findToken } from './controllers/token.controller.js';
import { subscriptionCancelled, subscriptionCreated } from './models/stripe.model.js';

const categories = {
  quotes: 0,
  sources: 1,
  authors: 2,
};
const values = {
  list: [getAllQuotes,getAllSources,getAllAuthors],
  random: [getRandomQuote,getRandomSource,getRandomAuthor],
  single: [getSingleQuote,getSingleSource,getSingleAuthor],
};

const stripe = new Stripe(process.env.STRIPE_SK);

const app = express();

app.use(
  json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.get("/", async (req, res) => {
  //TODO: write root function
  return res.sendStatus(200);
});

// app.get("/:category/:value?/:id?", async (req, res) => {
//   const apiKey = req.headers['x-api-key'];
//   if (!apiKey) {
//     return res.sendStatus(400);
//   };
//   const customer = await keyToCustomer(apiKey);
//   if (!customer || !customer.active) {
//     return res.sendStatus(403);
//   };
//   const category = req.params['category'];
//   if(category && !(category in categories)) {
//     return res.sendStatus(404);
//   };
//   const value = req.params['value'];
//   if(value && !(value in values)) {
//     return res.sendStatus(404);
//   };
//   const id = req.params['id'];
//   const result = id ? await values[value][category](id) : await values[value][category]();
//   const record = await stripe.subscriptionItems.createUsageRecord(
//     customer.itemId,
//     {
//       quantity: 1,
//       timestamp: 'now',
//       action: 'increment',
//     }
//   );
// });
  
app.get("/quotes/list", async (req, res) => {
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
  if(!quoteId) {
    return res.sendStatus(404);
  }
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

app.get("/sources/list", async (req, res) => {
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
  if(!sourceId) {
    return res.sendStatus(404);
  }
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

app.get("/authors/list", async (req, res) => {
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
    const authors = await getAllAuthors(page);
    if(authors === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: authors, usage: record});
    };
});

app.get("/authors/random", async (req, res) => {
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
    const author = await getSingleAuthor();
    if(author === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: author, usage: record});
    };
});

app.get("/authors/:id", async (req, res) => {
  const authorId = parseInt(req.params['id']);
  if(!authorId) {
    return res.sendStatus(404);
  }
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
    const author = await getSingleAuthor(authorId);
    if(author === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send({data: author, usage: record});
    };
});

app.get("/recover", async (req, res) => {
  const email = req.headers['email'];
  if(!findCustomerByEmail(email)) {
    return res.sendStatus(404);
  }
  const requestId = await sendReset(email);
  return res.status(200).send({requestId});
});

app.put("/reset", async (req, res) => {
  let { token, cid } = req.headers;
  console.log({token})
  token = await findToken(token);
  cid = cid.replace('-','_');
  if(!token) {
    console.log({token2: token})
    return res.sendStatus(404);
  }
  if(token.customerId !== cid) {
    return res.sendStatus(400);
  }
  let customer = await findCustomerById(cid);
  if(!customer) {
    console.log(2)
    return res.sendStatus(404);
  }
  let apiKeyMapping = await findAPIKey(customer.apiKey);
  if(!apiKeyMapping) {
    return res.sendStatus(404);
  }
  const {hashedAPIKey, apiKey} = generateAPIKey();
  customer.apiKey = apiKeyMapping.apiKey = hashedAPIKey;
  const customerId = await updateCustomer(customer);
  const apiKeyId = await updateAPIKey(apiKeyMapping);
  await deleteToken(token.entityId);
  const requestId = await sendNewKeyRecovered(customer.email, apiKey);
  return res.status(200).send({requestId});
});

// app.post("/checkout", async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//     mode: "subscription",
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price: process.env.PRICE_ID,
//       },
//     ],
//     success_url: `${process.env.PUBLIC_IP}/success?session_id={CHECKOUT_SESSION}`,
//     cancel_url: `${process.env.PUBLIC_IP}/error`,
//   });
//   return res.status(201).send(session);
// });

// app.get('/customers/:id', (req, res) => {
//   const customerId = req.params.id;
//   if (customerId) {
//     return res.send(customerId);
//   } else {
//     return res.sendStatus(404);
//   }
// });

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
    case 'customer.subscription.created':
      subscriptionCreated(data);
      break;
    case 'customer.subscription.deleted':
      subscriptionCancelled(data);
      break;
    case 'invoice.paid':
      //TODO: send invoice email
      break;
    case 'invoice.payment_failed':
      //TODO: set customer 'active' to false and send failed invoice email
      break;
    default:
      console.log(`Unhandled event type ${eventType}`);
      break;
  }
  return;
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);