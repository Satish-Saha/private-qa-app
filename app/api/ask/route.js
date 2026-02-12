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

        // 2. Generate embedding for question
        console.log('🧠 Generating question embedding...');
        const questionEmbedding = await getEmbedding(question);

        // 3. Compute cosine similarity
        console.log('🔍 Computing similarity scores...');
        const scoredChunks = storedChunks.map(chunk => ({
            ...chunk,
            similarity: cosineSimilarity(questionEmbedding, chunk.embedding)
        }));

        // 4. Retrieve top 3 most relevant chunks
        const topChunks = scoredChunks
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3)
            .filter(c => c.similarity > 0.05); // Lower threshold slightly

        if (topChunks.length === 0) {
            console.warn('⚠️ No relevant chunks found');
            return NextResponse.json({
                answer: 'No matching context found in your documents to answer this question.',
                found: false
            });
        }

        // 5. Build LLM prompt
        console.log(`🛰️ Calling Gemini with ${topChunks.length} context chunks...`);
        const contextText = topChunks.map(c => `[Source: ${c.document}]\n${c.text}`).join('\n\n');
        const prompt = `Answer ONLY using this context:\n\n${contextText}\n\nQuestion: ${question}`;

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
                text: c.text
            })),
            found: true
        });

    } catch (error) {
        console.error('❌ Ask API Error:', error);
        // Don't send exact error message if it contains long stack traces
        const message = error.message?.split('\n')[0] || 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
