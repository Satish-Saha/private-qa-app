const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'of', 'in', 'on', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'so', 'can', 'will', 'just', 'should', 'now', 'my', 'your', 'his', 'her', 'their', 'our'
]);

/**
 * Computes a simple keyword overlap score between a query and a text chunk.
 */
export function computeSimilarity(query, chunk) {
    const queryWords = tokenize(query);
    const chunkWords = tokenize(chunk);

    if (queryWords.length === 0) return 0;

    const chunkWordsSet = new Set(chunkWords);
    let score = 0;

    // Count how many keywords from the question appear in the chunk
    queryWords.forEach(word => {
        if (chunkWordsSet.has(word)) {
            score += 1;
        }
    });

    // Bonus for exact phrase match (naive)
    if (chunk.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
    }

    return score;
}

function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}
