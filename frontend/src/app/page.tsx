"use client";

import React, { useState, useRef, useEffect } from "react";
import { Scene } from "@/components/3d/Scene";
import { Mic, Send, Volume2, Sparkles, StopCircle, CloudRain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import our custom state and socket logic
import { useStore } from "@/lib/store";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function AuroraPlatform() {
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Zustand hook bridging
  const { messages, status, isMicActive, toggleMic } = useStore();

  // Connect to the FastAPI WebSocket. 
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/chat";
  const { sendTextMessage, readyState } = useWebSocket({
    url: `${WS_URL}/frontpage_agent_123?session=demo_session_${typeof window !== 'undefined' ? window.crypto.randomUUID().slice(0, 8) : '789'}`,
    onConnect: () => console.log("Demo connected to backend."),
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    sendTextMessage(inputMessage);
    setInputMessage("");
  };

  const isSpeaking = status === 'speaking';
  const isThinking = status === 'thinking';

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-violet-500/30">

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene isSpeaking={isSpeaking} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">

        {/* Header */}
        <header className="flex items-center justify-between p-6 w-full pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-xl border border-violet-500/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Aurora <span className="text-violet-400">AI</span></h1>

            {readyState === 1 ? (
              <span className="px-3 py-1.5 ml-3 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> AI Active
              </span>
            ) : readyState === 3 ? (
              <span className="px-3 py-1.5 ml-3 text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full flex items-center gap-1.5 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span> Offline Mode
              </span>
            ) : (
              <span className="px-3 py-1.5 ml-3 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center gap-1.5 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span> Initializing Engine...
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white/50 hover:text-white transition-colors" onClick={() => window.location.href = '/dashboard'}>Admin Dashboard</button>
            <button className="px-5 py-2.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              Embed on Website
            </button>
          </div>
        </header>

        {/* Info Banner */}
        <div className="w-full flex-1 flex flex-col justify-center items-start px-12 md:px-24 pointer-events-none max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 1.0, ease: "easeOut" }}
            className="space-y-6 bg-black/20 p-8 rounded-3xl backdrop-blur-sm border border-white/5"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight drop-shadow-2xl">
              Your <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Real-Time</span> <br />
              Digital Human.
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-lg font-light leading-relaxed">
              Engage your customers instantly with low-latency voice AI mapped onto photorealistic 3D avatars. Connects securely to FastAPI.
            </p>
          </motion.div>
        </div>

        {/* Floating Chat UI */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-[380px] h-[540px] pointer-events-auto flex flex-col bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">

          {/* Chat Header */}
          <div className="w-full flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-300" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121212] ${readyState === 1 ? 'bg-emerald-500' : readyState === 3 ? 'bg-red-500' : 'bg-amber-500'}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Aurora AI Core</h3>
                <p className="text-[11px] font-medium text-emerald-400/80 uppercase tracking-wider">
                  {readyState === 3 ? "System Offline" :
                    status === 'thinking' ? "Synthesizing..." :
                      status === 'speaking' ? "Transmitting..." :
                        "Awaiting Input"}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Transcript */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-5 scroll-smooth relative">
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

            {messages.length === 0 && (
              <div className="m-auto text-center flex flex-col items-center justify-center opacity-40 text-xs py-10 uppercase tracking-widest font-semibold">
                <CloudRain className="w-8 h-8 mb-3 opacity-50" />
                Neural link established.<br /> Speak or type to begin.
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`px-4 py-3 max-w-[85%] text-[13.5px] leading-relaxed shadow-lg ${msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-2xl rounded-br-sm border border-violet-500/30'
                    : 'bg-[#1e1e24]/80 backdrop-blur-xl text-white/90 border border-white/10 rounded-2xl rounded-bl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loader bubble */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex justify-start"
              >
                <div className="px-4 py-3.5 bg-[#1e1e24]/80 backdrop-blur-xl border border-white/10 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-lg">
                  <span className="w-1.5 h-1.5 bg-violet-400/80 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-violet-400/80 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-violet-400/80 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
            <div className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
            <div className="relative flex items-center">
              <button
                onClick={toggleMic}
                className={`absolute left-2 p-2 rounded-full transition-all flex items-center justify-center ${isMicActive
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'hover:bg-white/10 text-white/50'
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
                placeholder={readyState === 1 ? "Message Aurora..." : readyState === 3 ? "Connection failed." : "System initializing..."}
                disabled={readyState !== 1}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 rounded-full py-3.5 pl-12 pr-14 text-sm text-white placeholder:text-white/40 outline-none transition-all shadow-inner disabled:opacity-50"
              />

              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || readyState !== 1}
                className="absolute right-2 p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:text-white/30 text-white rounded-full transition-all shadow-lg hover:shadow-violet-500/50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
