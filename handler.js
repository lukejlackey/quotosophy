import serverless from "serverless-http";
import controller from './controllers/main.controller.js';

const app = controller();

export const handler = serverless(app);