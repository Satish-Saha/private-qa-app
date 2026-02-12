'use client';

import { Trash2, FileText, Database, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentList({ documents, onDelete, isLoading }) {
    if (isLoading) {
        return (
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500">Loading documents...</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 rounded-2xl transition-all h-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Database className="w-5 h-5 text-primary-600" />
                    Knowledge Base Items
                </h2>
                <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {documents.length} Files
                </span>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
                    <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-semibold">Empty Library</p>
                    <p className="text-[11px] text-slate-400 mt-1">Upload files to begin</p>
                </div>
            ) : (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {documents.map((doc) => (
                            <motion.div
                                key={doc._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group flex items-center justify-between p-3.5 bg-white/50 hover:bg-white border border-slate-100 hover:border-primary-200 rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex-shrink-0 p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-sm font-semibold text-slate-700 truncate" title={doc.filename}>
                                            {doc.filename}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(doc._id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Document"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
