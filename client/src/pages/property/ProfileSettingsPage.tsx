import React, { useState } from "react";
import { User, CreditCard, Bell, Lock, Loader2 } from "lucide-react";
import { AgentProfileSettings } from "./AgentProfileSettings";
import { useAuth } from "../../hooks/useAuth";

type TabType = "account" | "profile" | "payment" | "notifications";

export default function ProfileSettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("account");

    const allTabs = [
        { id: "account", label: "Account settings", icon: <Lock size={18} /> },
        { id: "profile", label: "Profile settings", icon: <User size={18} />, hidden: user?.role !== "LANDLORD" },
        { id: "payment", label: "Payment methods", icon: <CreditCard size={18} /> },
        { id: "notifications", label: "Email notification", icon: <Bell size={18} /> },
    ];

    const tabs = allTabs.filter(tab => !tab.hidden);

    return (
        <div className="pt-24 pb-16 min-h-screen bg-slate-50/50">
            <div className="container-page">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Settings</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === "account" && <AccountSettings />}
                        {activeTab === "profile" && <AgentProfileSettings />}
                        {activeTab === "payment" && <PlaceholderTab title="Payment Methods" />}
                        {activeTab === "notifications" && <PlaceholderTab title="Email Notifications" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccountSettings() {
    const [saving, setSaving] = useState(false);

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert("This is a demo. Implementation of password change requires backend support.");
        }, 1000);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="font-black text-slate-900">Change password</h3>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current password</label>
                    <input
                        type="password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Enter current password"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">New password</label>
                    <input
                        type="password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Enter new password"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirm password</label>
                    <input
                        type="password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Confirm new password"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        Change
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-8 p-8 border-t border-slate-100">
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-black text-slate-900">Want to delete profile?</h4>
                        <p className="text-xs text-slate-500 font-medium">You will lose all your data saved cars and searches</p>
                    </div>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
                        Delete profile
                    </button>
                </div>
            </div>
        </div>
    );
}

function PlaceholderTab({ title }: { title: string }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <User size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                This section is currently under development. Please check back later for more updates.
            </p>
        </div>
    );
}
