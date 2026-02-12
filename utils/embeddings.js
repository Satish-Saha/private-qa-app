import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini for Embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getEmbedding(text) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing');
        }

        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        const embedding = result.embedding.values;

        if (!embedding || !Array.isArray(embedding)) {
            throw new Error('Failed to retrieve valid embedding array from Gemini');
        }

        return Array.from(embedding);
    } catch (error) {
        console.error('❌ Gemini Embedding Error:', error);
        throw new Error(`Embedding failed: ${error.message}`);
    }
}
