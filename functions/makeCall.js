import verifyUser from "./verifyUser.js";
import { produceMessage } from "../sqs/handler.js";

export default async function makeCall(req, getFunc, getParams=null) {
    let result = await verifyUser(req);
    let usage = null;
    if (result.status === 200 && 'customer' in result) {
        usage = await produceMessage( result.customer.itemId );
        console.log({usage});
    } else if (result.status > 200) {
        return { status: result.status };
    }
    const data = (getParams !== null) ? await getFunc(getParams) : await getFunc();
    if (data === null) {
        return { status: 404 };
    }
    return { data };
}