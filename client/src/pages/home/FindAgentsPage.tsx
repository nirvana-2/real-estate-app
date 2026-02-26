import { useState, useEffect, useMemo } from 'react';
import { Search, UserCheck, Award, Star, Loader2 } from 'lucide-react';
import { PublicHero } from '../../components/layout/PublicHero';
import { AgentCard } from '../../components/property/AgentCard';
import { getAgents, type Agent } from '../../services/user.service';

export default function FindAgentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialty, setSpecialty] = useState("All");
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const apiSpecialty = specialty === "All" ? "ALL" : specialty.toUpperCase().replace(' ', '_');
                const data = await getAgents(apiSpecialty);
                setAgents(data.agents);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch agents", err);
                setError("Could not load agents. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [specialty]);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent =>
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.agentBio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, agents]);

    const HERO_IMAGE = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600";

    return (
        <div className="pb-20">
            <PublicHero
                title="Find an agent you can trust"
                subtitle="Work with the best in the industry. Our agents are vetted, experienced, and dedicated to helping you find your dream home."
                image={HERO_IMAGE}
            >
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Agent name, specialty, or bio"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e51013]/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </PublicHero>

            <section className="container-page py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Meet Our Experts</h2>
                        <p className="text-slate-500 mt-1 font-medium">Choose from our top-rated real estate professionals</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["All", "Luxury", "Residential", "Commercial", "New Construction"].map(s => (
                            <button
                                key={s}
                                onClick={() => setSpecialty(s)}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${specialty === s
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#e51013] animate-spin" />
                        <p className="mt-4 text-slate-500 font-bold">Fetching experts...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 card bg-red-50 border-red-100">
                        <p className="text-red-600 font-bold">{error}</p>
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="text-center py-20 card bg-slate-50 border-slate-100">
                        <p className="text-slate-500 font-bold">No agents found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredAgents.map(agent => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                )}

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                            <UserCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-3">Vetted Professionals</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Every agent on our platform goes through a rigorous vetting process to ensure they meet our high standards.
                        </p>
                    </div>
                    <div className="card p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-3">Award Winning</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Our agents are consistently ranked among the top performers in the region, bringing you unparalleled expertise.
                        </p>
                    </div>
                    <div className="card p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                            <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-3">Customer Focused</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            We prioritize your needs and goals, providing personalized service to help you make informed decisions.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

