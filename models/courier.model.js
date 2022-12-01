import { CourierClient } from "@trycourier/courier";
import { findCustomerByEmail } from "../controllers/customer.controller";
import { createToken } from "../controllers/token.controller";

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
    const customerId = await findCustomerByEmail(address).stripeCustomerId;
    const token = createToken(customerId);
    const resetLink = `${process.env.FRONTEND_URL}/reset?token=${token}&cid${customerId}`;
    return await sendEmail(address, process.env.RESET_EMAIL, {resetLink});
};

export async function sendNewKey(address, apiKey) {
    return await sendEmail(address, process.env.NEW_KEY_EMAIL, {apiKey});
};
