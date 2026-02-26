import { Phone, Mail, User, Building2 } from 'lucide-react';
import type { Agent } from '../../services/user.service';
import { Link } from 'react-router-dom';

export const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    return (
        <div className="card overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all flex flex-col h-full bg-white">
            <div className="relative h-64 bg-slate-100 overflow-hidden flex-shrink-0">
                {agent.agentPhoto ? (
                    <img
                        src={agent.agentPhoto}
                        alt={agent.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <User className="w-20 h-20" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <div className="bg-[#e51013] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {agent.specialty?.replace('_', ' ') || 'AGENT'}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div>
                    <h3 className="font-extrabold text-slate-900 text-xl leading-tight">{agent.name}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
                        {agent.agentBio || "No bio available."}
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    {agent.agentPhone && (
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-[#e51013]">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">{agent.agentPhone}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-[#e51013]">
                            <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold truncate">{agent.email}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                {agent.properties?.length || 0} Listings
                            </span>
                        </div>
                    </div>

                    <Link
                        to={`/find-agents/${agent.id}`}
                        className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center text-sm font-bold"
                    >
                        View Listings
                    </Link>
                </div>
            </div>
        </div>
    );
};
