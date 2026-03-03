"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("smd408411@gmail.com");
    const [password, setPassword] = useState("password");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Create x-www-form-urlencoded data for OAuth2 spec
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login/access-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to authenticate");
            }

            // Store securely (in actual prod, consider HttpOnly cookies)
            if (typeof window !== "undefined") {
                localStorage.setItem("aurora_token", data.access_token);
            }

            // Redirect to Dashboard
            window.location.href = "/dashboard";

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-white relative bg-black overflow-hidden font-sans">

            {/* Background Graphic - Massive Gradient Ball */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none mix-blend-screen" />

            {/* Left Column (Brand) */}
            <div className="hidden lg:flex flex-col w-1/2 justify-between p-16 relative z-10 border-r border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-xl border border-violet-500/30">
                        <Sparkles className="w-6 h-6 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Aurora <span className="text-violet-400">AI</span></h1>
                </div>

                <div className="space-y-6 max-w-lg">
                    <h2 className="text-5xl font-bold tracking-tighter leading-tight drop-shadow-2xl">
                        Manage your digital workforce.
                    </h2>
                    <p className="text-lg text-white/50 font-light">
                        Access your real-time agents, configure knowledge bases, and monitor live conversational intelligence globally.
                    </p>
                </div>

                <div className="text-sm text-white/40">
                    © 2026 Aurora AI Systems Inc.
                </div>
            </div>

            {/* Right Column (Auth Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md space-y-8 glass-card p-10 shadow-2xl">

                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-sm text-white/50">Enter your credentials to access your agents</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium text-center animate-in fade-in zoom-in duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-white/70 block px-1">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@aurora.com"
                                className="w-full bg-black/60 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between px-1">
                                <label className="text-sm font-medium text-white/70 block">Password</label>
                                <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-black/60 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all shadow-inner"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] mt-6"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in to Dashboard"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                        </button>
                    </form>

                    <div className="pt-6 text-center text-sm text-white/50 border-t border-white/5">
                        Don't have an enterprise account? <Link href="/register" className="text-white hover:text-violet-400 font-medium transition-colors">Contact Sales</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
