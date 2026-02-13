'use client';

import { BookOpen, Info, CheckCheck, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AnswerCard({ result, question }) {
    if (!result) return null;

    const { answer, sources, found } = result;

    const highlightText = (text, query) => {
        if (!query) return text;
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        if (words.length === 0) return text;

        const regex = new RegExp(`(${words.join('|')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-100/80 text-yellow-900 rounded-sm px-0.5 font-bold decoration-yellow-300 underline underline-offset-2">
                    {part}
                </mark>
            ) : part
        );
    };

    const components = {
        text: ({ value }) => highlightText(value, question),
        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-slate-700">{children}</p>,
        h1: ({ children }) => <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">{children}</h3>,
        ul: ({ children }) => <ul className="space-y-2 mb-4 list-disc pl-5 text-slate-700">{children}</ul>,
        ol: ({ children }) => <ol className="space-y-2 mb-4 list-decimal pl-5 text-slate-700">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        code: ({ children }) => <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded-md font-mono text-sm border border-slate-200">{children}</code>,
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${found ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                            {found ? <Sparkles className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Answer</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                {found ? (
                                    <>
                                        <CheckCheck className="w-3 h-3 text-emerald-500" />
                                        Verified
                                    </>
                                ) : 'No Context'}
                            </p>
                        </div>
                    </div>

                    {found && sources && (
                        <div className="flex -space-x-1.5">
                            {Array.from(new Set(sources.map(s => s.document))).slice(0, 3).map((doc, idx) => (
                                <div key={idx} className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500" title={doc}>
                                    {doc.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                    {found ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {answer}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-slate-500 italic">{answer}</p>
                    )}
                </div>

                {found && sources && sources.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Info className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Sources</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {sources.map((src, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-4 h-4 text-slate-300 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{src.document}</span>
                                                {src.similarity && (
                                                    <span className="text-[9px] font-bold text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded-md">
                                                        {src.similarity}% MATCH
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 italic leading-relaxed">
                                                "...{highlightText(src.text, question)}..."
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
