import React from "react";
import { Activity, Zap, Headphones, BarChart3, UploadCloud, CheckCircle, Settings, MessageSquare } from "lucide-react";

export default function DashboardOverview() {
    const metrics = [
        { label: "Active Sessions Live", value: "32", icon: <Activity className="text-emerald-400 w-5 h-5" />, sub: "+12% from last hour" },
        { label: "Total Conversations", value: "1,245", icon: <MessageSquare className="text-violet-400 w-5 h-5" />, sub: "This month" },
        { label: "Voice Latency Avg", value: "720ms", icon: <Zap className="text-amber-400 w-5 h-5" />, sub: "Opimized (Standard)" },
        { label: "Voice Minutes Used", value: "340 / 500", icon: <Headphones className="text-blue-400 w-5 h-5" />, sub: "Approaching limits" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-white/50">{m.label}</span>
                            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                                {m.icon}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mt-2 tracking-tight">{m.value}</h3>
                        <p className="text-xs text-white/40">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main Configuration Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Agent Setup */}
                <div className="glass-card col-span-2 p-8 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-violet-400" /> Primary Agent Setup
                        </h2>
                        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-sm font-medium rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-white/70 block mb-2">Agent Name</label>
                            <input type="text" defaultValue="Sophie - Sales Rep" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-white/70 block mb-2">System Instructions (Prompt)</label>
                            <textarea rows={4} defaultValue="You are Sophie, a helpful sales representative for Acme Corp. Be concise, polite, and guide users to the pricing page when asked." className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none resize-none font-mono" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-white/70 block mb-2">3D Avatar Model ID</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none">
                                    <option>Sophie (realistic_f.glb)</option>
                                    <option>Adam (realistic_m.glb)</option>
                                    <option>Custom ReadyPlayerMe...</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white/70 block mb-2">Voice Synthesis ID (ElevenLabs)</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none">
                                    <option>Rachel (American, Friendly)</option>
                                    <option>Drew (British, Professional)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deploy / Status / Code Snippet */}
                <div className="space-y-6">
                    {/* Widget Embed Code */}
                    <div className="glass-card p-6 border-emerald-500/20 shadow-[0_4px_24px_0_rgba(16,185,129,0.1)]">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> Ready to Embed
                        </h3>
                        <p className="text-sm text-white/60 mb-4">Copy this snippet before the closing &lt;/body&gt; tag of your website.</p>

                        <div className="relative group">
                            <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-emerald-300 border border-white/10 overflow-x-auto">
                                {"<script\n  src=\"https://cdn.aurora-ai.com/widget.js\"\n  data-agent-id=\"ag_99xz21\"\n></script>"}
                            </pre>
                            <button className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded block opacity-0 group-hover:opacity-100 transition-opacity text-xs">Copy</button>
                        </div>
                    </div>

                    {/* Knowledge RAG Status */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-blue-400" /> Custom Knowledge (RAG)
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                                <span className="text-white/80">Acme_Pricing_2026.pdf</span>
                                <span className="text-emerald-400 font-medium">Synced (120 Vectors)</span>
                            </div>
                            <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                                <span className="text-white/80">FAQ_Overrides.txt</span>
                                <span className="text-emerald-400 font-medium">Synced (45 Vectors)</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 border border-dashed border-white/20 hover:border-violet-500 hover:bg-violet-500/10 text-white/70 hover:text-white transition-all py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2">
                            <UploadCloud className="w-4 h-4" /> Upload Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


