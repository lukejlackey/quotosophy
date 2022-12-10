import { config } from 'dotenv';
config();
import express, { json } from "express";

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

export default app;