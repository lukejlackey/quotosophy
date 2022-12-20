import { CourierClient } from "@trycourier/courier";
import { findCustomerByEmail } from "../models/customer.model.js";
import { createToken } from "../models/token.model.js";

const courier = CourierClient({ authorizationToken: process.env.COURIER_AUTH });

async function sendEmail(address, template, data) {
    const { requestId } = await courier.send({
        message: {
            to: {
            email: address,
            },
            template,
            data: data,
        },
    });
    return requestId;
}

export async function sendReset(address) {
    const customer = await findCustomerByEmail(address);
    let customerId = customer.stripeCustomerId;
    const token = await createToken(customerId);
    const resetLink = `${process.env.FRONTEND_URL}/reset?token=${token}&cid=${customerId.replace('_','-')}`;
    return await sendEmail(address, process.env.RESET_EMAIL, {resetLink});
};

export async function sendNewKey(address, apiKey) {
    return await sendEmail(address, process.env.NEW_KEY_EMAIL, {apiKey});
};

export async function sendNewKeyRecovered(address, apiKey) {
    return await sendEmail(address, process.env.NEW_KEY_RECV_EMAIL, {apiKey});
};
