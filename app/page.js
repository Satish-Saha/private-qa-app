'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UploadForm from '@/components/UploadForm';
import DocumentList from '@/components/DocumentList';
import QuestionBox from '@/components/QuestionBox';
import AnswerCard from '@/components/AnswerCard';
import { BookOpen, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Home() {
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const [question, setQuestion] = useState('');
    const [answerResult, setAnswerResult] = useState(null);
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

    const fetchDocuments = async () => {
        setIsLoadingDocs(true);
        try {
            const response = await fetch('/api/documents');
            const data = await response.json();
            if (response.ok) {
                setDocuments(data);
            }
        } catch (error) {
            // Error handled by UI states
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        const deleteToast = toast.loading('Deleting document...');
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Document deleted successfully', { id: deleteToast });
                setDocuments(prev => prev.filter(doc => doc._id !== id));
            } else {
                toast.error(data.error || 'Failed to delete document', { id: deleteToast });
            }
        } catch (error) {
            toast.error('Network error. Failed to delete.', { id: deleteToast });
        }
    };

    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoadingAnswer(true);
        setAnswerResult(null);
        const askToast = toast.loading('Searching documents...');

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            let data;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                throw new Error('SERVER_TIMEOUT');
            }

            if (response.ok) {
                toast.success('Found relevant information!', { id: askToast });
                setAnswerResult({ ...data, question });
            } else {
                toast.error(data.error || 'Failed to get an answer', { id: askToast });
                setAnswerResult({ answer: data.error || 'Error processing your question.', found: false });
            }
        } catch (error) {
            let userMessage = 'Network error. Please try again.';
            if (error.message === 'SERVER_TIMEOUT') {
                userMessage = 'The AI server is busy or timed out. Please try asking again in a few seconds.';
            } else if (error.message.includes('Unexpected end of JSON input')) {
                userMessage = 'Search failed. The server took too long to generate an answer.';
            }

            toast.error(userMessage, { id: askToast, duration: 5000 });
            setAnswerResult({ answer: userMessage, found: false });
        } finally {
            setIsLoadingAnswer(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <header className="mb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary-600 text-white rounded-2xl shadow-xl mb-6 ring-4 ring-primary-100">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Private Knowledge <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">Q&A</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium mb-8">
                    A secure mini-workspace for your local documents.
                    Get instant, keyword-mapped answers without any external AI APIs.
                </p>

                <div className="flex justify-center gap-4 mb-12">
                    <Link
                        href="/status"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <Activity className="w-4 h-4 text-primary-600" />
                        System Status
                    </Link>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { step: '1', title: 'Upload', desc: 'Securely upload .txt files' },
                        { step: '2', title: 'Manage', desc: 'View your library below' },
                        { step: '3', title: 'Ask', desc: 'Enter your question' },
                        { step: '4', title: 'Explore', desc: 'See answer + sources' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/50 backdrop-blur-sm border border-white p-4 rounded-3xl shadow-sm text-left">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-lg shadow-primary-200">
                                {item.step}
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                            <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-4 space-y-8 sticky top-8">
                    <UploadForm onUploadSuccess={fetchDocuments} />
                    <DocumentList
                        documents={documents}
                        onDelete={handleDelete}
                        isLoading={isLoadingDocs}
                    />
                </div>

                <div className="lg:col-span-8 space-y-8">
                    <QuestionBox
                        question={question}
                        setQuestion={setQuestion}
                        onAsk={handleAsk}
                        isLoading={isLoadingAnswer}
                        disabled={documents.length === 0}
                    />

                    <AnswerCard
                        result={answerResult}
                        question={question}
                    />

                    {!answerResult && !isLoadingAnswer && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center"
                        >
                            <div className="bg-white p-5 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm ring-1 ring-slate-100">
                                <Search className="text-primary-300 w-10 h-10" />
                            </div>
                            <h3 className="text-slate-600 font-bold text-xl">Curiosity at your fingertips</h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Upload documents in the left sidebar to start exploring your private data library.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            <footer className="mt-24 text-center border-t border-slate-200 pt-8 pb-12">
                <p className="text-slate-400 text-sm font-medium italic">© 2026 Private QA Mini Workspace. Built with Next.js & MongoDB.</p>
            </footer>
        </div>
    );
}

// Minimal Search Icon for empty state
function Search({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}
