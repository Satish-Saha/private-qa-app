import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';
import { removeByDocument } from '@/lib/vectorStore';

export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        await dbConnect();

        const deletedDoc = await Document.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // Remove from in-memory vector store
        removeByDocument(deletedDoc.filename);

        return NextResponse.json({ message: 'Document deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
