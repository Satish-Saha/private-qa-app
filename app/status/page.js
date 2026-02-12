'use client';

import { useState, useEffect } from 'react';
import { Activity, Database, FileText, Search, CheckCircle2, AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const StatusCard = ({ icon: Icon, title, value, isOk, subtext }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group h-full"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${isOk ? 'from-emerald-500/10 to-teal-500/5' : 'from-amber-500/10 to-orange-500/5'} rounded-[2.5rem] -inline-block -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className={`glass-card p-8 rounded-[2rem] border border-white/40 shadow-xl shadow-slate-200/50 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-white/60 hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl ${isOk ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} shadow-inner`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase ${isOk ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    {isOk ? 'Active' : 'Warning'}
                </div>
            </div>

            <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
                <div className="space-y-1">
                    <p className="text-3xl font-black text-slate-800 leading-none tracking-tight">{value}</p>
                    {subtext && <p className="text-slate-400 text-xs font-medium">{subtext}</p>}
                </div>
            </div>

            <div className={`mt-8 pt-4 border-t border-slate-100 flex items-center justify-between`}>
                <span className={`text-[11px] font-bold ${isOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isOk ? 'System stable' : 'Issue detected'}
                </span>
                {isOk ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
            </div>
        </div>
    </motion.div>
);

export default function StatusPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            setStatus(data);
            setError(null);
        } catch (err) {
            console.error('❌ Status fetch error:', err);
            setError('Failed to reach status API');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="text-primary-600 w-10 h-10" />
                        System Health
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time status of your Private Q&A Mini Workspace</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchStatus}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                    >
                        <Home className="w-4 h-4" />
                        Back Home
                    </Link>
                </div>
            </div>

            {loading && !status ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium">Analyzing systems...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-red-900 font-bold text-xl">Service Unreachable</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatusCard
                        title="Backend API"
                        value={status.backend}
                        isOk={status.backend === 'OK'}
                        icon={Activity}
                    />
                    <StatusCard
                        title="Database"
                        value={status.database}
                        isOk={status.dbConnected}
                        icon={Database}
                        subtext={status.timestamp}
                    />
                    <StatusCard
                        title="Documents Stored"
                        value={status.documentCount}
                        isOk={true}
                        icon={FileText}
                        subtext="Available for search"
                    />
                    <StatusCard
                        title="Search Engine"
                        value={status.searchEngine}
                        isOk={status.searchReady}
                        icon={Search}
                        subtext={status.searchReady ? "Ready to compute similarity" : "Upload documents to activate"}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Systems Analysis Summary</h3>
                                <p className="text-slate-400 text-sm max-w-md">
                                    All systems are running on a local Next.js environment. Similarity search is powered by
                                    keyword-mapped scoring without external AI dependencies.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</p>
                                    <p className="text-2xl font-mono font-bold text-emerald-400">{status.responseTime}</p>
                                </div>
                                <div className="w-px h-8 bg-white/20"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Environment</p>
                                    <p className="text-lg font-bold">Production</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
                    </motion.div>
                </div>
            )}

            <footer className="mt-16 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                Private Knowledge AI • Built for Performance & Privacy
            </footer>
        </div>
    );
}
