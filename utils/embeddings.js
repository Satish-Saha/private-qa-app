import { pipeline, env } from '@xenova/transformers';

// Configuration for local environment
env.allowLocalModels = false; // Force downloading if not in high-security environment
env.useBrowserCache = false;

let extractor = null;

export async function getEmbedding(text) {
    try {
        if (!extractor) {
            console.log('🏗️ Initializing embedding model (this may take a moment on first run)...');
            extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('✅ Model ready');
        }

        const output = await extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error('❌ Embedding Generation Error:', error);
        throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
}
