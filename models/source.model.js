import { getAllItems, getSingleItem } from "./redis.model.js";

export async function getAllSources(page=1) {
    return await getAllItems(
        "WHERE w.workId > $floor WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry ORDER BY w.workId LIMIT $limit",
        page,
    )
}

export async function getSingleSource(sourceId=null) {
    return await getSingleItem(
        "WHERE w.workId = $inputId WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry LIMIT $limit",
        "WITH w, a, COLLECT(q.quote) AS quotesList RETURN {id: w.workId, title: w.name , quotes: quotesList , author: a.name} AS entry ORDER BY rand() LIMIT $limit",
        sourceId,
    )
}

export async function getRandomSource() {
    return await getSingleSource();
}