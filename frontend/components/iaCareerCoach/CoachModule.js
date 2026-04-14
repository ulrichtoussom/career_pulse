'use client';

import { useState } from 'react';
import SessionSetup from './SessionSetup';
import ChatInterface from './ChatInterface';
import InterviewPrep from './InterviewPrep';

const TABS = [
    {
        id: 'chat',
        label: 'Coach Chat',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
        ),
    },
    {
        id: 'interview',
        label: "Entretien",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
        ),
    },
];

export default function CoachModule() {
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('chat');

    if (!session) {
        return (
            <div className="h-full overflow-y-auto bg-slate-50">
                <SessionSetup onSessionCreated={(s) => setSession(s)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Session header */}
            <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Session active</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{session.title}</p>
                </div>
                <button
                    onClick={() => setSession(null)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors shrink-0 border border-slate-200 rounded-lg px-2.5 py-1"
                >
                    Changer
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-white px-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all mr-1 ${
                            activeTab === tab.id
                                ? 'border-violet-600 text-violet-700'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {activeTab === 'chat' && <ChatInterface session={session} />}
                {activeTab === 'interview' && <InterviewPrep session={session} />}
            </div>
        </div>
    );
}
