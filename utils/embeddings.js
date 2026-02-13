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

        const errorText = error.message || '';
        let userFriendlyReason = 'The AI service is temporarily unavailable.';

        if (errorText.includes('API_KEY_INVALID') || errorText.includes('API Key not found')) {
            userFriendlyReason = 'AI Configuration Error: Your Gemini API key is invalid or has expired. Please check your .env.local or Vercel settings.';
        } else if (errorText.includes('429') || errorText.toLowerCase().includes('quota')) {
            userFriendlyReason = 'Rate Limit Reached: The AI service is receiving too many requests. Please try again in 1 minute.';
        } else if (errorText.includes('404')) {
            userFriendlyReason = 'Model Error: The embedding model is not supported in your API key\'s region.';
        } else if (errorText.includes('CONFIG_ERROR')) {
            userFriendlyReason = errorText.split(': ')[1] || errorText;
        }

        throw new Error(userFriendlyReason);
    }
}
