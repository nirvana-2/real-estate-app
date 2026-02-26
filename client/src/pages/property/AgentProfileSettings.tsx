import React, { useState, useEffect } from "react";
import { UserCheck, Shield, Phone, Briefcase, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getUserProfile, updateAgentProfile, type AgentProfilePayload } from "../../services/user.service";
import type { AgentSpecialty } from "../../auth-types/auth.types";

export const AgentProfileSettings: React.FC = () => {
    const [isAgent, setIsAgent] = useState(false);
    const [agentBio, setAgentBio] = useState("");
    const [agentPhone, setAgentPhone] = useState("");
    const [agentPhoto, setAgentPhoto] = useState("");
    const [specialty, setSpecialty] = useState<AgentSpecialty>("RESIDENTIAL");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setIsAgent(profile.isAgent || false);
                setAgentBio(profile.agentBio || "");
                setAgentPhone(profile.agentPhone || "");
                setAgentPhoto(profile.agentPhoto || "");
                if (profile.specialty) setSpecialty(profile.specialty);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load profile setting");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload: AgentProfilePayload = {
                isAgent,
                agentBio,
                agentPhone,
                agentPhoto,
                specialty
            };
            await updateAgentProfile(payload);
            toast.success("Agent profile updated successfully!");
        } catch (error) {
            console.error("Failed to update agent profile", error);
            toast.error("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#e51013]" />
        </div>
    );

    return (
        <div className="card p-8 bg-white border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e51013]/5 rounded-bl-full -mr-16 -mt-16" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#e51013]/10 text-[#e51013] flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">Agent Profile Settings</h2>
                    <p className="text-sm font-medium text-slate-500">Opt-in to be listed as a verified real estate agent.</p>
                </div>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">List me as an Agent</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Public Visibility</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isAgent}
                            onChange={(e) => setIsAgent(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e51013]"></div>
                    </label>
                </div>

                {isAgent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Professional Bio</label>
                            <textarea
                                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 min-h-[120px] transition-all"
                                placeholder="Describe your experience and commitment to clients..."
                                value={agentBio}
                                onChange={(e) => setAgentBio(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 transition-all"
                                    placeholder="+977 98XXXXXXXX"
                                    value={agentPhone}
                                    onChange={(e) => setAgentPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Agent Specialty</label>
                            <div className="relative">
                                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <select
                                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 transition-all appearance-none cursor-pointer"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value as AgentSpecialty)}
                                >
                                    <option value="RESIDENTIAL">Residential</option>
                                    <option value="LUXURY">Luxury Homes</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                    <option value="NEW_CONSTRUCTION">New Construction</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Agent Photo URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 transition-all"
                                placeholder="https://example.com/photo.jpg"
                                value={agentPhoto}
                                onChange={(e) => setAgentPhoto(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-900/20"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save Agent Profile
                    </button>
                </div>
            </div>
        </div>
    );
};
