import { useProperties } from '../../hooks/useProperties';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { PublicHero } from '../../components/layout/PublicHero';
import { PropertyCard } from '../../components/property/PropertyCard';

export default function NewHomesPage() {
    const { properties, loading } = useProperties({
        page: 1,
        limit: 8
    });

    const newProperties = properties;

    const HERO_IMAGE = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1600";

    return (
        <div className="pb-20">
            <PublicHero
                title="Be the first to see new homes"
                subtitle="Stay ahead of the market with our latest listings. From newly constructed villas to recently renovated apartments."
                image={HERO_IMAGE}
            >
                <div className="mt-8">
                    <button className="btn-accent px-8 py-4 rounded-2xl flex items-center gap-2">
                        View All Recent Listings
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </PublicHero>

            <section className="container-page py-16">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Recently Listed</h2>
                        <p className="text-slate-500 font-medium">Updated every day with new opportunities</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#e51013] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newProperties.map(p => (
                            <PropertyCard key={p.id} p={p} />
                        ))}
                    </div>
                )}

                <div className="mt-20 card p-10 bg-slate-900 text-white overflow-hidden relative">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-extrabold mb-4">Never miss a new listing</h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Sign up for alerts and be the first to know when a property matching your criteria hits the market.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#e51013]/50 transition-all"
                            />
                            <button className="btn-accent px-8 py-4 rounded-2xl">
                                Get Alerts
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                        <Sparkles className="w-full h-full text-white" />
                    </div>
                </div>
            </section>
        </div>
    );
}
