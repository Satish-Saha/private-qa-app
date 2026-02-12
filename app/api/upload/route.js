import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';
import { chunkText } from '@/utils/chunkText';
import { getEmbedding } from '@/utils/embeddings';
import { addChunks } from '@/lib/vectorStore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const savedDocuments = [];

        for (const file of files) {
            if (file.name.endsWith('.txt')) {
                const text = await file.text();

                // 1. Save reference to MongoDB for UI
                const doc = await Document.create({
                    filename: file.name,
                    content: text,
                });
                savedDocuments.push(doc);

                // 2. Chunks & Embeddings (RAG Requirement)
                // Chunk size ≈ 500 characters, Overlap ≈ 50 characters
                const chunks = chunkText(text, 500, 50);

                const vectorChunks = [];
                for (const chunkContent of chunks) {
                    const embedding = await getEmbedding(chunkContent);
                    vectorChunks.push({
                        id: uuidv4(),
                        text: chunkContent,
                        document: file.name,
                        embedding: embedding
                    });
                }

                // 3. Store chunks in memory
                addChunks(vectorChunks);
            }
        }

        if (savedDocuments.length === 0) {
            return NextResponse.json({ error: 'No valid .txt files found' }, { status: 400 });
        }

        return NextResponse.json({
            message: `Successfully uploaded ${savedDocuments.length} documents and generated embeddings`,
            documents: savedDocuments
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload documents' }, { status: 500 });
    }
}
