import app from '../app.js'
import { recover, reset } from "./apiKey.controller.js";
import { webhooks } from "./stripe.controller.js";
import { quotesId, quotesList, quotesRandom } from "./quote.controller.js";
import { sourcesId, sourcesList, sourcesRandom } from "./source.controller.js";
import { authorsId, authorsList, authorsRandom } from "./author.controller.js";

export default function controller() {
    
    //API Keys
    app.get('/recover', recover);
    app.put('/reset', reset);

    //Stripe Webhooks
    app.post('/webhooks', webhooks);

    //Quotes
    app.get('/quotes/list', quotesList);
    app.get('/quotes/random', quotesRandom);
    app.get('/quotes/:id', quotesId);

    //Source Texts
    app.get('/sources/list', sourcesList);
    app.get('/sources/random', sourcesRandom);
    app.get('/sources/:id', sourcesId);

    //Authors
    app.get('/authors/list', authorsList);
    app.get('/authors/random', authorsRandom);
    app.get('/authors/:id', authorsId);

    //404: Not Found
    app.use((req, res) => {
        return res.status(404).json({
            error: "Not Found",
        });
    });

    return app;
};
