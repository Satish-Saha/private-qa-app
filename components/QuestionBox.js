'use client';

import { Search, Send, Loader2 } from 'lucide-react';

export default function QuestionBox({ question, setQuestion, onAsk, isLoading, disabled }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onAsk();
    };

    return (
        <div className="glass-card p-8 rounded-2xl mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary-600" />
                Ask a Question
            </h2>

            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={disabled ? "Please upload documents first..." : "What would you like to know?"}
                    disabled={isLoading || disabled}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 rounded-2xl py-4 pl-5 pr-14 text-slate-800 placeholder:text-slate-400 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed group-hover:border-slate-300 group-hover:bg-white"
                />
                <button
                    type="submit"
                    disabled={isLoading || !question.trim() || disabled}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-lg shadow-primary-200 disabled:shadow-none"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>

            {!disabled && (
                <p className="mt-3 text-xs text-slate-400">
                    Try: "Who is the CEO?" or "What are the company values?"
                </p>
            )}
        </div>
    );
}
