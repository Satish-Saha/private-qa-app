import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini for Embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getEmbedding(text, isQuery = false) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('CONFIG_ERROR: GEMINI_API_KEY is missing in your environment variables.');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        // Use task-specific embeddings for better retrieval accuracy
        const result = await model.embedContent({
            content: { parts: [{ text }] },
            taskType: isQuery ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
        });

        const embedding = result.embedding.values;

        if (!embedding || !Array.isArray(embedding)) {
            throw new Error('INVALID_RESPONSE: The API did not return a valid vector array.');
        }

        return Array.from(embedding);
    } catch (error) {
        console.error('❌ Gemini Embedding Error:', error);

        // Return clear, actionable error text
        const reason = error.message?.split('\n')[0] || 'Unknown API Error';
        throw new Error(`AI Service Error: ${reason}`);
    }
}
