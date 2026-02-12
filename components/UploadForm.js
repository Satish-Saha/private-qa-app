'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function UploadForm({ onUploadSuccess }) {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(file => file.name.endsWith('.txt'));
        if (selectedFiles.length === 0) {
            setError('Please select .txt files only');
            return;
        }
        setFiles(prev => [...prev, ...selectedFiles]);
        setError(null);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setError(null);
        const uploadToast = toast.loading('Uploading documents...');

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            toast.success('Documents uploaded successfully!', { id: uploadToast });
            setFiles([]);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            toast.error(err.message, { id: uploadToast });
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Documents
            </h2>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept=".txt"
                    className="hidden"
                />
                <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" />
                    <p className="text-slate-600">Click to browse the files</p>
                    <p className="text-xs text-slate-400 mt-1">Supported formats: .txt</p>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2 overflow-hidden"
                    >
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {isUploading ? 'Uploading...' : 'Upload Files'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
}
