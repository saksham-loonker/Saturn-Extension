import React, { useState, useMemo } from 'react';
import { HistoryItem, Tab } from '../types';
import { Search, X, Clock, Trash2, Globe, MessageSquare, RotateCcw, Calendar } from 'lucide-react';

interface HistoryViewProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    archivedTabs: Tab[];
    onSelectHistory: (item: HistoryItem) => void;
    onRestoreTab: (tabId: string) => void;
    onClear: () => void;
}

export default function HistoryView({ isOpen, onClose, history, archivedTabs, onSelectHistory, onRestoreTab, onClear }: HistoryViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'chats' | 'log'>('chats');

    const filteredHistory = useMemo(() => {
        return history.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [history, searchTerm]);

    const filteredArchives = useMemo(() => {
        return archivedTabs.filter(tab =>
            tab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tab.messages[0]?.content || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [archivedTabs, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-[60] bg-zen-bg/95 backdrop-blur-2xl flex flex-col animate-fade-in">
            <div className="max-w-5xl mx-auto w-full h-full flex flex-col p-8 md:p-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <h2 className="text-4xl font-bold tracking-tighter text-zen-text">Library</h2>
                        <div className="flex bg-zen-surface rounded-full p-1 border border-zen-border">
                            <button
                                onClick={() => setActiveTab('chats')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'chats' ? 'bg-zen-text text-zen-bg shadow-sm' : 'text-zen-muted hover:text-zen-text'}`}
                            >
                                Chats
                            </button>
                            <button
                                onClick={() => setActiveTab('log')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'log' ? 'bg-zen-text text-zen-bg shadow-sm' : 'text-zen-muted hover:text-zen-text'}`}
                            >
                                Search Log
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-zen-surface hover:bg-zen-bg border border-zen-border flex items-center justify-center transition-colors group"
                    >
                        <X className="w-5 h-5 text-zen-muted group-hover:text-zen-text" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-8 group">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zen-muted group-focus-within:text-zen-accent transition-colors" />
                    <input
                        type="text"
                        placeholder={activeTab === 'chats' ? "Search your conversations..." : "Search your browsing history..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-zen-border/50 rounded-2xl py-5 pl-14 pr-6 text-xl text-zen-text placeholder-zen-muted/40 focus:ring-0 focus:border-zen-accent focus:bg-black/30 transition-all outline-none"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                    {activeTab === 'chats' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredArchives.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-zen-muted opacity-50">
                                    <MessageSquare className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-medium">No conversations found</p>
                                </div>
                            ) : (
                                filteredArchives.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { onRestoreTab(tab.id); onClose(); }}
                                        className="flex flex-col p-6 rounded-3xl bg-zen-surface/40 border border-zen-border/50 hover:bg-zen-surface hover:border-zen-accent/50 transition-all group text-left h-48 relative overflow-hidden hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between w-full mb-3">
                                            <div className="p-2 rounded-xl bg-zen-bg border border-zen-border text-zen-accent">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-mono text-zen-muted">{new Date(tab.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-zen-text mb-2 line-clamp-2 group-hover:text-zen-accent transition-colors">
                                            {tab.title}
                                        </h3>
                                        <p className="text-sm text-zen-muted line-clamp-3 opacity-70">
                                            {tab.messages.find(m => m.role === 'user')?.content || "No preview available"}
                                        </p>
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zen-surface/90 to-transparent" />
                                    </button>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-zen-muted opacity-50">
                                    <Clock className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-medium">No history entries</p>
                                </div>
                            ) : (
                                filteredHistory.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { onSelectHistory(item); onClose(); }}
                                        className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-zen-surface/60 border border-transparent hover:border-zen-border transition-all text-left group"
                                    >
                                        <div className={`p-3 rounded-xl ${item.type === 'search' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {item.type === 'search' ? <Search className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-zen-text truncate group-hover:text-zen-accent transition-colors">{item.title}</h3>
                                            <p className="text-xs text-zen-muted truncate font-mono opacity-60">{item.url}</p>
                                        </div>
                                        <div className="text-xs text-zen-muted font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && activeTab === 'log' && (
                    <div className="mt-8 border-t border-zen-border/30 pt-6 flex justify-end">
                        <button
                            onClick={() => {
                                if (confirm('Clear entire browsing history?')) {
                                    onClear();
                                }
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold uppercase tracking-wide"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}