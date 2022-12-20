import { getAllItems, getSingleItem } from "./redis.model.js";

export async function getAllQuotes(page=1) {
    return await getAllItems(
        "WHERE q.quoteId > $floor RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry ORDER BY q.quoteId LIMIT $limit",
        page,
    )
}

export async function getSingleQuote(quoteId=null) {
    return await getSingleItem(
        "WHERE q.quoteId = $inputId RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry LIMIT $limit",
        "RETURN {id: q.quoteId, quote: q.quote , source: w.name , author: a.name} AS entry ORDER BY rand() LIMIT $limit",
        quoteId,
    )
}

export async function getRandomQuote() {
    return await getSingleQuote();
}