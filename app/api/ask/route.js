import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';
import { getEmbedding } from '@/utils/embeddings';
import { getAllChunks, cosineSimilarity, addChunks } from '@/lib/vectorStore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chunkText } from '@/utils/chunkText';
import { v4 as uuidv4 } from 'uuid';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
    try {
        console.log('🤖 Received Q&A request...');
        const { question } = await request.json();

        if (!question || question.trim() === '') {
            return NextResponse.json({ error: 'No question entered' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY missing');
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        await dbConnect();

        // 1. Ensure chunks are in memory (Sync from DB if memory is empty)
        let storedChunks = getAllChunks();
        if (storedChunks.length === 0) {
            console.log('🔄 Memory empty, hydrating from MongoDB...');
            const documents = await Document.find({});
            if (documents.length > 0) {
                const vectorChunks = [];
                for (const doc of documents) {
                    console.log(`📄 Processing ${doc.filename}...`);
                    const chunks = chunkText(doc.content, 500, 50);
                    for (const chunkContent of chunks) {
                        const embedding = await getEmbedding(chunkContent);
                        vectorChunks.push({
                            id: uuidv4(),
                            text: chunkContent,
                            document: doc.filename,
                            embedding: embedding
                        });
                    }
                }
                addChunks(vectorChunks);
                storedChunks = getAllChunks();
                console.log(`✅ Loaded ${storedChunks.length} chunks into memory`);
            }
        }

        if (storedChunks.length === 0) {
            return NextResponse.json({ error: 'No documents uploaded yet' }, { status: 400 });
        }

        // 2. Generate embedding for question (using isQuery = true)
        console.log('🧠 Generating question embedding...');
        const questionEmbedding = await getEmbedding(question, true);

        // 3. Compute cosine similarity
        console.log('🔍 Computing similarity scores...');
        const scoredChunks = storedChunks.map(chunk => ({
            ...chunk,
            similarity: cosineSimilarity(questionEmbedding, chunk.embedding)
        }));

        // 4. Retrieve top 5 most relevant chunks (increased from 3 for better coverage)
        const topChunks = scoredChunks
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)
            .filter(c => c.similarity > 0.01);

        if (topChunks.length === 0) {
            console.warn('⚠️ No relevant chunks found');
            return NextResponse.json({
                answer: 'No matching context found in your documents to answer this question. Try making your question more specific.',
                found: false
            });
        }

        console.log(`🔍 Retrieved ${topChunks.length} chunks from: ${[...new Set(topChunks.map(c => c.document))].join(', ')}`);

        // 5. Build LLM prompt
        console.log(`🛰️ Calling Gemini with ${topChunks.length} context chunks...`);
        const contextText = topChunks.map(c => `[DOCUMENT: ${c.document}]\n${c.text}`).join('\n\n---\n\n');

        const prompt = `You are a helpful assistant. Use the following document snippets to answer the user's question. 
If the information is not in the context, say you don't know based on the documents. 
If asked about "my" name, role, or details, look for personal identifiers like "Name" or "Role" in the snippets.

CONTEXT SNIPPETS:
${contextText}

QUESTION: ${question}

ANSWER:`;

        // 6. Call Gemini Chat Completion API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        console.log('✨ Gemini responded successfully');

        // 7. Return response
        return NextResponse.json({
            answer: answer,
            sources: topChunks.map(c => ({
                document: c.document,
                text: c.text,
                similarity: Math.round(c.similarity * 100) // Percentage score
            })),
            found: true
        });

    } catch (error) {
        console.error('❌ Ask API Error:', error);

        // Friendly Error Masking
        let userMessage = 'An unexpected error occurred while processing your question.';

        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
            userMessage = 'The AI service is currently busy due to high demand (Rate Limit). Please wait a few seconds and try your question again.';
        } else if (error.message.includes('403') || error.message.includes('permission')) {
            userMessage = 'Configuration Error: Access denied. Please check your Gemini API key permissions.';
        } else if (error.message.includes('404')) {
            userMessage = 'AI Model Error: The requested model could not be found. Please check your model configuration.';
        } else {
            // Provide a clean snippet of the error if it's not a common API limit
            userMessage = `Service Error: ${error.message.split('\n')[0]}`;
        }

        return NextResponse.json({ error: userMessage }, { status: 500 });
    }
}
