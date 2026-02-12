import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: [true, 'Please provide a filename.'],
    },
    content: {
        type: String,
        required: [true, 'Please provide the document content.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
