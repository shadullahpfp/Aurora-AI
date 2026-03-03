"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, Zap, UserPlus } from "lucide-react";

export default function SettingsBillingPage() {
    const [loading, setLoading] = useState(false);

    const handleStripeCheckout = async (tier: string) => {
        setLoading(true);
        try {
            // Example integration via standard REST API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/billing/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
            }
        } catch (e) {
            console.error("Billing failure", e);
        } finally {
            setLoading(false);
        }
    };

    const handlePortalAccess = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/billing/portal`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) { }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">

            {/* Overview Card */}
            <div className="glass-card p-8 flex justify-between items-center group">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        Acme Corp SAAS
                    </h2>
                    <p className="text-white/50 text-sm mt-1">Tenant ID: 8a32d165-8b92-4f01-9878-3a9a7df1fbbb</p>
                </div>
                <button onClick={handlePortalAccess} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Manage Billing in Stripe
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Starter Plan */}
                <div className="glass-card p-8 flex flex-col justify-between border-t-4 border-t-white/10 opacity-70">
                    <div>
                        <h3 className="text-xl font-bold">Starter</h3>
                        <div className="my-4">
                            <span className="text-4xl font-bold">$29</span>
                            <span className="text-sm text-white/50">/mo</span>
                        </div>
                        <ul className="space-y-3 text-sm text-white/70 mb-8">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 1 AI Agent</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 200 Voice Minutes</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Standard Viseme Sync</li>
                        </ul>
                    </div>
                    <button disabled className="w-full py-3 bg-white/5 rounded-lg text-sm text-white/50 cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="glass-card p-8 flex flex-col justify-between border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)] relative">
                    <div className="absolute top-0 right-0 bg-violet-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                        Popular
                    </div>
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-violet-400" /> Pro
                        </h3>
                        <div className="my-4">
                            <span className="text-4xl font-bold">$99</span>
                            <span className="text-sm text-white/50">/mo</span>
                        </div>
                        <ul className="space-y-3 text-sm text-white/70 mb-8">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> 5 AI Agents</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> 1000 Voice Minutes</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Multi-Document RAG Context</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => handleStripeCheckout('price_pro')}
                        disabled={loading}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white font-medium transition-colors"
                    >
                        {loading ? 'Processing...' : 'Upgrade limit'}
                    </button>
                </div>

                {/* Enterprise */}
                <div className="glass-card p-8 flex flex-col justify-between border-t-4 border-t-blue-500/50">
                    <div>
                        <h3 className="text-xl font-bold">Enterprise</h3>
                        <div className="my-4">
                            <span className="text-4xl font-bold">Custom</span>
                        </div>
                        <ul className="space-y-3 text-sm text-white/70 mb-8">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Unlimited AI Agents</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Bulk Voice Minutes</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Custom 3D ReadyPlayerMe Rigs</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-white text-black hover:bg-white/90 rounded-lg text-sm font-medium transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>

            {/* Users / Seats Placeholder */}
            <div className="glass-card p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-white/50" /> Team Seats
                    </h3>
                    <button className="text-sm text-violet-400 hover:text-violet-300">Invite Member</button>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center font-bold">JL</div>
                        <div>
                            <h4 className="font-medium text-sm">John Lead</h4>
                            <p className="text-xs text-white/50">smd408411@gmail.com</p>
                        </div>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Admin</span>
                </div>
            </div>
        </div>
    );
}
