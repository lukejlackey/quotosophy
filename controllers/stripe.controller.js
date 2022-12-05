import { stripe, subscriptionCancelled, subscriptionCreated } from '../models/stripe.model.js'

//POST
export async function webhooks(req, res) {
    try {
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
            } catch (err) {
                console.error(`Webhook Error: ${err.message}`);
                throw `Webhook Error: ${err.message}`;
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
    } catch (error) {
        return res.status(500).send(error)
    }
};