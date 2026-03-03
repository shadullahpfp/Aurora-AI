"use client";

import React, { useState, useEffect, useRef } from "react";
import { Scene } from "@/components/3d/Scene";
import { Mic, Send, Volume2, Sparkles, StopCircle, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function EmbedWidgetPage({ params }: { params: { agentId: string } }) {
    const [inputMessage, setInputMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Zustand Global Hooks 
    const { messages, status, isMicActive, toggleMic } = useStore();

    // Setup standard Websocket url pointing to Agent ID injected via params
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/chat";
    const { sendTextMessage, readyState } = useWebSocket({
        url: `${WS_URL}/${params.agentId}?session=embed_${Date.now()}`,
        onConnect: () => console.log(`Widget logic bound to Agent ID: ${params.agentId}`),
    });

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, status]);

    // Host Window PostMessage Bridge (To receive user details or website routes dynamically)
    useEffect(() => {
        const handleHostMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'HOST_MESSAGE') {
                    console.log(`Received context from host domain for ${params.agentId}:`, data.text);
                }
            } catch (e) { }
        };

        window.addEventListener("message", handleHostMessage);
        return () => window.removeEventListener("message", handleHostMessage);
    }, [params.agentId]);

    const handleSend = () => {
        if (!inputMessage.trim()) return;
        sendTextMessage(inputMessage);
        setInputMessage("");
    };

    const isSpeaking = status === 'speaking';
    const isThinking = status === 'thinking';

    return (
        <div className="w-full h-screen bg-black/80 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden text-white font-sans relative">

            {/* 3D Scene Background embedded securely */}
            <div className="absolute inset-0 z-0 opacity-90 mix-blend-screen pointer-events-none bg-gradient-to-t from-violet-900/10 to-black">
                <Scene isSpeaking={isSpeaking} />
            </div>

            {/* Widget Header */}
            <div className="relative z-10 w-full flex items-center justify-between p-3 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-violet-300" />
                        </div>
                        {readyState === 1 ? (
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
                        ) : (
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-black" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">Aurora Embed</h3>
                        <p className="text-[10px] uppercase tracking-wider font-semibold">
                            {readyState === 1 ? <span className="text-emerald-400">System Ready</span> : <span className="text-amber-400">Initializing...</span>}
                        </p>
                    </div>
                </div>
                <button className="text-[10px] bg-white/10 p-1.5 rounded-full text-white/50 hover:text-white transition-colors">
                    <Volume2 className="w-3 h-3" />
                </button>
            </div>

            {/* Embedded Chat Readout */}
            <div ref={scrollRef} className="relative z-10 flex-1 p-3 overflow-y-auto flex flex-col gap-3 scroll-smooth bg-gradient-to-t from-black/80 via-black/20 to-transparent">

                {messages.length === 0 && (
                    <div className="m-auto text-center opacity-40 text-xs py-10 uppercase tracking-widest font-semibold flex flex-col items-center">
                        <Zap className="w-6 h-6 mx-auto mb-2 opacity-50 text-emerald-400" />
                        Awaiting Input
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`px-3 py-2 text-[13px] leading-relaxed shadow-lg border ${msg.role === 'user'
                            ? 'bg-violet-600/90 border-violet-500/50 text-white rounded-2xl rounded-br-sm max-w-[85%]'
                            : 'bg-[#1e1e24]/80 backdrop-blur-xl text-white/90 border-white/10 rounded-2xl rounded-bl-sm max-w-[90%]'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="flex justify-start animate-in fade-in zoom-in duration-300">
                        <div className="px-3 py-2.5 bg-[#1e1e24]/80 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-lg">
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Widget Input Area */}
            <div className="relative z-10 p-3 pt-2 pb-4 bg-black/80 backdrop-blur-3xl border-t border-white/10">
                <div className="relative flex items-center shadow-lg">
                    <button
                        onClick={toggleMic}
                        className={`absolute left-1.5 p-1.5 rounded-full transition-all flex items-center justify-center ${isMicActive
                            ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                            : 'hover:bg-white/10 text-white/60'
                            }`}
                    >
                        {isMicActive ? (
                            <>
                                <StopCircle className="w-4 h-4 relative z-10" />
                                <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping"></span>
                            </>
                        ) : (
                            <Mic className="w-4 h-4" />
                        )}
                    </button>

                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={readyState === 1 ? "Ask me anything..." : "Waiting for backend..."}
                        disabled={readyState !== 1}
                        className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 rounded-full py-2.5 pl-10 pr-10 text-[13px] text-white placeholder:text-white/40 outline-none transition-all"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!inputMessage.trim() || readyState !== 1}
                        className="absolute right-1.5 p-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:text-white/30 text-white rounded-full transition-colors font-medium shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

        </div>
    );
}
