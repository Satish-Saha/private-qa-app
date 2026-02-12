import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini for Embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getEmbedding(text) {
    try {
        if (!process.env.GEMINI_API_KEY) {
        }

        // Using embedding-001 as it has the widest regional support and stability
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(text);
        const embedding = result.embedding.values;

        if (!embedding || !Array.isArray(embedding)) {
            throw new Error('Failed to retrieve valid embedding array');
        }

        return Array.from(embedding);
    } catch (error) {
        console.error('❌ Gemini Embedding Error:', error);

        // Provide a user-friendly error message instead of technical API details
        let friendlyMessage = 'The AI categorization service is temporarily unavailable. Please try again in a few moments.';

        if (error.message.includes('404')) {
            friendlyMessage = 'AI Model Error: The requested embedding model is not available in your region or is misconfigured.';
        } else if (error.message.includes('API_KEY')) {
            friendlyMessage = 'Configuration Error: Valid Gemini API Key is missing in environment variables.';
        }

        throw new Error(friendlyMessage);
    }
}
