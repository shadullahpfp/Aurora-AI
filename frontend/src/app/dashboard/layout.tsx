"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Users, MessageSquare, Database, Settings, LogOut, ChevronRight } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = React.useState("Overview");

    const menu = [
        { name: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
        { name: "My Agents", icon: <Users className="w-5 h-5" />, href: "/dashboard/agents" },
        { name: "Knowledge Base", icon: <Database className="w-5 h-5" />, href: "/dashboard/knowledge" },
        { name: "Conversations", icon: <MessageSquare className="w-5 h-5" />, href: "/dashboard/conversations" },
        { name: "Settings & Billing", icon: <Settings className="w-5 h-5" />, href: "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-black border-r border-white/10 flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-emerald-400">
                            Aurora <span className="text-white">Admin</span>
                        </h1>
                        <p className="text-xs text-white/40 mt-1">Tenant: Acme Corp SAAS</p>
                    </div>

                    <nav className="mt-6 px-4 space-y-2">
                        {menu.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveTab(item.name)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.name
                                        ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                                        : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-white/5 transition-all">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative gradient-bg">
                {/* Subtle top nav */}
                <header className="sticky top-0 z-10 p-6 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center text-sm text-white/50">
                        Dashboard <ChevronRight className="w-4 h-4 mx-1" /> <span className="text-white">{activeTab}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                            Pro Plan Activated
                        </div>
                        <img src="https://i.pravatar.cc/150?img=11" className="w-9 h-9 rounded-full border border-white/20" />
                    </div>
                </header>

                {/* Page Content injected here */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
