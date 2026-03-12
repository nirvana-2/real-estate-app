import { useState } from 'react';
import { Search, Loader2, Users, AlertCircle } from 'lucide-react';
import { PublicHero } from '../../components/layout/PublicHero';
import { AgentCard } from '../../components/agent/AgentCard';
import { useAgents } from '../../hooks/useAgents';

const SPECIALTIES = [
    { label: 'All', value: 'All' },
    { label: 'Luxury', value: 'LUXURY' },
    { label: 'Residential', value: 'RESIDENTIAL' },
    { label: 'Commercial', value: 'COMMERCIAL' },
    { label: 'New Construction', value: 'NEW_CONSTRUCTION' },
];

export default function FindAgentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialty, setSpecialty] = useState("All");
    const [page, setPage] = useState(1);

    const { agents, loading, error, pagination } = useAgents({
        search: searchTerm,
        specialty,
        page,
        limit: 12,
    });

    const HERO_IMAGE = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600";

    return (
        <div className="pb-20">
            <PublicHero
                title="Find an agent you can trust"
                subtitle="Work with the best in the industry. Our agents are vetted, experienced, and dedicated to helping you find your dream home."
                image={HERO_IMAGE}
            >
                <div className="mt-8 max-w-2xl">
                    <div className="relative group">
                        <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or biography..."
                            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e51013]/50 transition-all font-medium text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </PublicHero>

            <section className="container-page py-16">
                {/* Filters Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Expert Professionals</h2>
                        <p className="text-slate-500 font-medium">Connect with real estate experts in your preferred area</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SPECIALTIES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => {
                                    setSpecialty(s.value);
                                    setPage(1);
                                }}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm ${specialty === s.value
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-[#e51013] animate-spin" />
                        <p className="mt-4 text-slate-500 font-bold text-lg animate-pulse">Finding agents...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 px-6 rounded-3xl bg-red-50 border border-red-100 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Failed to Load Agents</h3>
                        <p className="text-red-600 font-medium mb-8">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-accent px-8 py-3 rounded-xl"
                        >
                            Retry Loading
                        </button>
                    </div>
                ) : agents.length === 0 ? (
                    <div className="text-center py-24 px-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No Agents Found</h3>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                            We couldn't find any agents matching your current search or specialty filters. Try adjusting your criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {agents.map((agent) => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => {
                                            setPage(p);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }}
                                        className={`w-12 h-12 rounded-xl font-black transition-all ${page === p
                                                ? "bg-[#e51013] text-white shadow-lg shadow-[#e51013]/20"
                                                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
