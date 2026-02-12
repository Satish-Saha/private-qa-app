import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const startTime = Date.now();
        await dbConnect();

        // Check MongoDB connection state
        const dbState = mongoose.connection.readyState;
        const dbStatusMap = {
            0: 'Disconnected',
            1: 'Connected',
            2: 'Connecting',
            3: 'Disconnecting',
        };

        const docCount = await Document.countDocuments({});
        const responseTime = Date.now() - startTime;

        return NextResponse.json({
            backend: 'OK',
            database: dbStatusMap[dbState] || 'Unknown',
            dbConnected: dbState === 1,
            documentCount: docCount,
            searchEngine: docCount > 0 ? 'Ready' : 'Waiting for documents',
            searchReady: docCount > 0,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            backend: 'OK',
            database: 'Error',
            dbConnected: false,
            documentCount: 0,
            searchEngine: 'Unavailable',
            error: error.message
        }, { status: 500 });
    }
}
