"use client";

import React, { useState } from "react";
import { MessageSquare, Calendar, User, Search, Play, Pause, DownloadCloud, Clock } from "lucide-react";

export default function ConversationsLogsPage() {
    const [activeSession, setActiveSession] = useState<number | null>(1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mocked Postgres session data
    const sessions = [
        {
            id: 1,
            uuid: "se_83jd92k1l",
            customerIP: "192.168.1.1 (Texas)",
            date: "Today, 10:42 AM",
            duration: "02m 14s",
            minUsed: 2.2,
            agent: "Sophie - Sales Rep",
            messages: [
                { role: "agent", content: "Hello! Welcome to Acme Corp. How can I help you today?", time: "00:00" },
                { role: "user", content: "Hi, I'm looking for pricing on the Enterprise plan.", time: "00:10" },
                { role: "agent", content: "Great! Our Enterprise plan is custom priced based on your volume. Would you like me to connect you with our lead sales director?", time: "00:14" },
                { role: "user", content: "Yes please.", time: "00:43" }
            ]
        },
        {
            id: 2,
            uuid: "se_mk02las1",
            customerIP: "10.0... (London)",
            date: "Yesterday, 14:12 PM",
            duration: "05m 30s",
            minUsed: 5.5,
            agent: "Adam - Support",
            messages: [
                { role: "agent", content: "Support desk online. What issue are you facing?", time: "00:00" },
                { role: "user", content: "I forgot my password and the reset link isn't arriving.", time: "00:45" },
                { role: "agent", content: "I can help with that. Please verify the email address connected to your account.", time: "00:52" }
            ]
        }
    ];

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in zoom-in duration-500">

            {/* Session List Panel */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search transcripts or IPs..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-violet-500/50 outline-none backdrop-blur-md"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeSession === session.id
                                    ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                    : 'bg-black/30 border-white/5 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-white/70">{session.uuid}</span>
                                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                    {session.duration}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                                <User className="w-3.5 h-3.5 text-white/50" /> {session.customerIP}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-white/40">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.minUsed} min</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transcript Readout Panel */}
            <div className="w-2/3 glass-card flex flex-col overflow-hidden relative border border-white/10 shadow-2xl">
                {activeSession ? (
                    <>
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 bg-black/50 backdrop-blur-md flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-violet-400" />
                                    Session Transcript
                                </h2>
                                <p className="text-xs text-white/50 mt-1">Agent: {sessions.find(s => s.id === activeSession)?.agent}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Audio Playback Mock */}
                                <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-violet-400 transition-colors">
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                                    </button>
                                    <div className="w-24 h-1 bg-white/10 rounded overflow-hidden">
                                        <div className={`h-full bg-violet-400 rounded transition-all duration-1000 ${isPlaying ? 'w-2/3' : 'w-0'}`} />
                                    </div>
                                    <span className="text-[10px] text-white/50 font-mono">01:12 / {sessions.find(s => s.id === activeSession)?.duration}</span>
                                </div>
                                <button className="text-white/50 hover:text-white bg-white/5 p-2 rounded-lg border border-white/10 transition-colors">
                                    <DownloadCloud className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages view */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative scroll-smooth bg-gradient-to-b from-transparent to-black/40">
                            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                            {sessions.find(s => s.id === activeSession)?.messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`} style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl relative shadow-lg ${msg.role === 'user'
                                            ? 'bg-violet-600/90 text-white border-violet-500/50 rounded-br-[4px]'
                                            : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 rounded-bl-[4px]'
                                        }`}>
                                        <span className={`absolute -top-5 text-[10px] font-mono text-white/30 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                                            {msg.time}
                                        </span>
                                        <p className="text-sm leading-relaxed tracking-wide">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="h-6" /> {/* Scroll padding */}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-white/30 space-y-4 bg-gradient-to-t from-violet-900/10 to-transparent">
                        <Search className="w-12 h-12 opacity-50 text-violet-400" />
                        <p className="text-sm tracking-wide">Select a session on the left to view the interactive transcript.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
