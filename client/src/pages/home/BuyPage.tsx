import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { PublicHero } from '../../components/layout/PublicHero';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useProperties } from '../../hooks/useProperties';
import { AdvancedFiltersModal } from '../../pages/property/AdvancedFiltersModal';
import type{ AdvancedFilters } from '../../types/AdvancedFilters.types';
import { defaultAdvancedFilters } from '../../types/AdvancedFilters.types';

export default function BuyPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [page, setPage] = useState(1);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [appliedAdvanced, setAppliedAdvanced] = useState<AdvancedFilters>(defaultAdvancedFilters);

    const activeAdvancedCount = Object.values(appliedAdvanced).filter(v => v !== '').length;

    useEffect(() => {
        setPage(1);
    }, [searchTerm, priceRange, propertyType, appliedAdvanced]);

    const getPriceFilters = (range: string) => {
        if (range === "0-50L") return { maxPrice: 5000000 };
        if (range === "50L-1Cr") return { minPrice: 5000001, maxPrice: 10000000 };
        if (range === "1Cr-2Cr") return { minPrice: 10000001, maxPrice: 20000000 };
        if (range === "2Cr-5Cr") return { minPrice: 20000001, maxPrice: 50000000 };
        if (range === "5Cr+") return { minPrice: 50000001 };
        return {};
    };

    const { properties, loading, pagination } = useProperties({
        scope: 'public',
        page,
        limit: 8,
        filters: {
            search: searchTerm,
            propertyType: propertyType || undefined,
            listingType: "SALE",
            ...getPriceFilters(priceRange),
            minBedrooms: appliedAdvanced.minBedrooms ? Number(appliedAdvanced.minBedrooms) : undefined,
            maxBedrooms: appliedAdvanced.maxBedrooms ? Number(appliedAdvanced.maxBedrooms) : undefined,
            minBathrooms: appliedAdvanced.minBathrooms ? Number(appliedAdvanced.minBathrooms) : undefined,
            maxBathrooms: appliedAdvanced.maxBathrooms ? Number(appliedAdvanced.maxBathrooms) : undefined,
            minArea: appliedAdvanced.minArea ? Number(appliedAdvanced.minArea) : undefined,
            maxArea: appliedAdvanced.maxArea ? Number(appliedAdvanced.maxArea) : undefined,
            minYearBuilt: appliedAdvanced.minYearBuilt ? Number(appliedAdvanced.minYearBuilt) : undefined,
            maxYearBuilt: appliedAdvanced.maxYearBuilt ? Number(appliedAdvanced.maxYearBuilt) : undefined,
            minFloors: appliedAdvanced.minFloors ? Number(appliedAdvanced.minFloors) : undefined,
            maxFloors: appliedAdvanced.maxFloors ? Number(appliedAdvanced.maxFloors) : undefined,
        }
    });

    return (
        <div className="pb-20">
            <PublicHero
                title="Find your next home to buy"
                subtitle="Explore the latest properties for sale in your favorite neighborhoods. From modern apartments to spacious family homes."
            >
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Address, City, or Neighborhood"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e51013]/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-accent px-8 py-4 rounded-2xl">Search</button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1.5 px-1">Property Type</label>
                        <select
                            className="w-full bg-transparent text-white focus:outline-none cursor-pointer font-bold text-sm"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <option value="" className="text-slate-900">All Types</option>
                            <option value="HOUSE" className="text-slate-900">Houses</option>
                            <option value="APARTMENT" className="text-slate-900">Apartments</option>
                            <option value="LAND" className="text-slate-900">Land</option>
                            <option value="COMMERCIAL" className="text-slate-900">Commercial</option>
                        </select>
                    </div>
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1.5 px-1">Price Range</label>
                        <select
                            className="w-full bg-transparent text-white focus:outline-none cursor-pointer font-bold text-sm"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        >
                            <option value="" className="text-slate-900">All Prices</option>
                            <option value="0-50L" className="text-slate-900">0-50L</option>
                            <option value="50L-1Cr" className="text-slate-900">50L-1Cr</option>
                            <option value="1Cr-2Cr" className="text-slate-900">1Cr-2Cr</option>
                            <option value="2Cr-5Cr" className="text-slate-900">2Cr-5Cr</option>
                            <option value="5Cr+" className="text-slate-900">Above 5Cr</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setShowAdvanced(true)}
                            className="relative w-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Advanced Filters
                            {activeAdvancedCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#e51013] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                                    {activeAdvancedCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </PublicHero>

            <AdvancedFiltersModal
                isOpen={showAdvanced}
                onClose={() => setShowAdvanced(false)}
                onApply={(filters) => setAppliedAdvanced(filters)}
                onReset={() => setAppliedAdvanced(defaultAdvancedFilters)}
                initialFilters={appliedAdvanced}
            />

            <section className="container-page py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                        {properties.length} Properties Found
                    </h2>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        Sort by:
                        <select className="bg-transparent border-none focus:ring-0 text-slate-900 cursor-pointer">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#e51013] animate-spin" />
                    </div>
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {properties.map(p => (
                                <PropertyCard key={p.id} p={p} />
                            ))}
                        </div>
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold cursor-pointer disabled:cursor-not-allowed">Previous</button>
                                <div className="flex items-center gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${page === i + 1 ? "bg-[#e51013] text-white shadow-lg shadow-red-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{i + 1}</button>
                                    ))}
                                </div>
                                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold cursor-pointer disabled:cursor-not-allowed">Next</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">No properties found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters to find more properties.</p>
                    </div>
                )}
            </section>
        </div>
    );
}