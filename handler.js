import sls from "serverless-http";
import controller from './controllers/main.controller.js';

const app = controller();
export const api = sls(app);
