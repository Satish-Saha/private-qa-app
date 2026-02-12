import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';

export async function GET() {
    try {
        await dbConnect();
        const documents = await Document.find({}).sort({ createdAt: -1 });
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
