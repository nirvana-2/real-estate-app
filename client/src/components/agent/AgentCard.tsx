import React from 'react';
import { Phone, Mail, User, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AgentPublicProfile } from '../../types/agent';

interface AgentCardProps {
    agent: AgentPublicProfile;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const specialtyColors: Record<string, string> = {
        LUXURY: 'bg-amber-100 text-amber-700 border-amber-200',
        RESIDENTIAL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        COMMERCIAL: 'bg-blue-100 text-blue-700 border-blue-200',
        NEW_CONSTRUCTION: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const specialtyLabel: Record<string, string> = {
        LUXURY: 'Luxury',
        RESIDENTIAL: 'Residential',
        COMMERCIAL: 'Commercial',
        NEW_CONSTRUCTION: 'New Construction',
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            {/* Profile Photo / Avatar Fallback */}
            <div className="relative h-64 bg-slate-50 overflow-hidden">
                {agent.agentPhoto ? (
                    <img
                        src={agent.agentPhoto}
                        alt={agent.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-extrabold text-slate-400">
                            {getInitials(agent.name)}
                        </div>
                    </div>
                )}

                {/* Specialty Badge */}
                {agent.specialty && (
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${specialtyColors[agent.specialty] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {specialtyLabel[agent.specialty] || agent.specialty}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#e51013] transition-colors">{agent.name}</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1 line-clamp-2 min-h-[40px]">
                        {agent.agentBio || "No agent biography provided."}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-6 py-3 border-y border-slate-50">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        {agent.activeListings} Active Listings
                    </span>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <a
                        href={agent.agentPhone ? `tel:${agent.agentPhone}` : '#'}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${agent.agentPhone
                            ? "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            }`}
                        onClick={(e) => !agent.agentPhone && e.preventDefault()}
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                    </a>
                    <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                    </a>
                </div>

                {/* View Listings Link */}
                <Link
                    to={`/buy?agent=${agent.id}`}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#e51013] transition-all shadow-lg shadow-slate-900/10 hover:shadow-[#e51013]/20 mt-auto"
                >
                    View Listings
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};
