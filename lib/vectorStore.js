/**
 * Simple In-Memory Vector Store
 * Requirement: Store chunks in memory with id, text, document, embedding.
 */

if (!global.vectorStore) {
    global.vectorStore = {
        chunks: []
    };
}

const vectorStore = global.vectorStore;

export function addChunks(newChunks) {
    // newChunks: array of { id, text, document, embedding }
    vectorStore.chunks.push(...newChunks);
}

export function getAllChunks() {
    return vectorStore.chunks;
}

export function clearStore() {
    vectorStore.chunks = [];
}

export function removeByDocument(filename) {
    vectorStore.chunks = vectorStore.chunks.filter(c => c.document !== filename);
}

export function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
