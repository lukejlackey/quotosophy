import { getAllItems, getSingleItem } from "./redis.model.js";

export async function getAllAuthors(page=1) {
    return await getAllItems(
        "WHERE w.workId > $floor WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry ORDER BY a.authorId LIMIT $limit",
        page,
    )
}

export async function getSingleAuthor(authorId=null) {
    return await getSingleItem(
        "WHERE a.authorId = $inputId WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry LIMIT $limit",
        "WITH a, COLLECT(w.name) AS worksList, COLLECT(q.quote) AS quotesList RETURN {id: a.authorId , name: a.name , quotes: quotesList , texts: worksList} AS entry ORDER BY rand() LIMIT $limit",
        authorId,
    )
}

export async function getRandomAuthor() {
    return await getSingleAuthor();
}