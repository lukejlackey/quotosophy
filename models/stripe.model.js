import Stripe from 'stripe';
import { createAPIKey } from '../models/apiKey.model.js';
import { cancelCustomerById, createCustomer } from '../models/customer.model.js';
import generateAPIKey from "../functions/generateAPIKey.js";
import { sendNewKey } from './courier.model.js';

export const stripe = new Stripe(process.env.STRIPE_SK);

export async function subscriptionCreated(data) {

    const customerId = data.object.customer;
    const itemId = data.object.items.data[0].id;
    let customerEmail = await stripe.customers.retrieve(customerId);
    customerEmail = customerEmail.email;

    //TODO: handle duplicate subscriptions/accounts
    
    console.log(`Customer ${customerId} subscribed to plan ${itemId}!`);

    const { hashedAPIKey, apiKey } = generateAPIKey();

    const newCustomer = await createCustomer({
        stripeCustomerId: customerId,
        apiKey: hashedAPIKey,
        active: true,
        itemId,
        email: customerEmail,
    });

    console.log({newCustomer});

    const newAPIKeyRecord = await createAPIKey(customerId, hashedAPIKey);

    const requestId = await sendNewKey(customerEmail, apiKey);

    return requestId;
}

export async function subscriptionCancelled(data) {

    const customerId = data.object.customer;
    let customerEmail = await stripe.customers.retrieve(customerId);
    customerEmail = customerEmail.email;
    
    const id = cancelCustomerById(customerId);

    console.log(`Customer ${customerId} cancelled plan.`);

    //TODO: figure out email for cancel

    return id;
}