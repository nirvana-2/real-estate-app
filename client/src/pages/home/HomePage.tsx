import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LineChart, MapPin, Search, TrendingUp, Plus } from "lucide-react";
import { useProperties } from "../../hooks/useProperties";
import { useAuth } from "../../hooks/useAuth";
import type { ListingType, PropertyType } from "../../auth-types/property.types";
import { PropertyCard } from "../../components/property/PropertyCard";
import { Modal } from "../../../common/Ui-model/Model"
import { HomeLoansCalculator } from "../../components/finance/HomeLoanCalculator";
import { RatesTrends } from "../../components/market/RatesandTrend";
import { InvestmentHotspots } from "../../components/market/InvestmentHotspot";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600";



export default function HomePage() {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [activeTab, setActiveTab] = useState<ListingType>("RENT");
  const [showModal, setShowModal] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [location, propertyType, maxPrice, activeTab]);

  const { properties, loading, error, pagination } = useProperties({
    scope: 'public',
    page,
    limit: 8,
    filters: {
      search: location,
      propertyType: propertyType || undefined,
      listingType: activeTab,
      maxPrice: maxPrice,
    },
  });

  const featured = properties;

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of properties)
      counts[p.propertyType] = (counts[p.propertyType] ?? 0) + 1;
    return counts;
  }, [properties]);

  // ← Fixed: just set state, don't return JSX
  const handleModal = () => {
    setShowModal(true)
  }

  return (
    <div className="pb-16">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#eaf4ff]">
        <div className="container-page pt-12 pb-10 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              {user?.role === "LANDLORD" && (
                <div className="flex flex-wrap gap-3 mb-6">
                  <Link
                    to="/property/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e51013] text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-[#c40e10] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Link>
                  <a
                    href="#featured"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Search className="w-4 h-4 text-[#e51013]" />
                    See Available Property
                  </a>
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                Find your <span className="text-[#e51013]">dream</span> home{" "}
                <br className="hidden sm:block" />
                today
              </h1>
              <p className="mt-5 text-slate-600 text-lg max-w-xl">
                Browse verified listings, compare neighborhoods, and find the
                perfect place to live or invest.
              </p>

              {/* Search bar */}
              {user?.role !== "LANDLORD" && (
                <div className="mt-8 card p-4 sm:p-5 shadow-xl shadow-slate-900/5 border-white/50 bg-white/80 backdrop-blur">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => {
                        setActiveTab("RENT");
                        if (maxPrice > 10000) setMaxPrice(5000);
                      }}
                      className={`btn-ghost px-6 py-2 rounded-xl transition-all font-bold ${activeTab === "RENT"
                        ? "bg-[#e51013] text-white"
                        : "bg-white shadow-sm border border-slate-100"
                        }`}
                    >
                      Rent
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("SALE");
                        if (maxPrice < 10000) setMaxPrice(10000000);
                      }}
                      className={`btn-ghost px-6 py-2 rounded-xl transition-all font-bold ${activeTab === "SALE"
                        ? "bg-[#e51013] text-white"
                        : "bg-white shadow-sm border border-slate-100"
                        }`}
                    >
                      Buy
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-12 lg:col-span-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Location
                      </label>
                      <div className="relative mt-1">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          className="input pl-10"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, address, or keyword"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-6 lg:col-span-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Property type
                      </label>
                      <select
                        className="select mt-1"
                        value={propertyType}
                        onChange={(e) =>
                          setPropertyType(
                            (e.target.value as PropertyType) || ""
                          )
                        }
                      >
                        <option value="">Any</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="HOUSE">House</option>
                        <option value="LAND">Land</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>

                    <div className="md:col-span-6 lg:col-span-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Price Range
                      </label>
                      <select
                        className="select mt-1 w-full"
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        value={maxPrice}
                      >
                        <option value={99999999}>Any Price</option>
                        {activeTab === "RENT" ? (
                          <>
                            <option value={10000}>Under Rs. 10,000</option>
                            <option value={25000}>Rs. 10,000 – Rs. 25,000</option>
                            <option value={50000}>Rs. 25,000 – Rs. 50,000</option>
                            <option value={100000}>Rs. 50,000 – Rs. 1 Lakh</option>
                            <option value={500000}>Rs. 1 Lakh – Rs. 5 Lakh</option>
                            <option value={1000000}>Rs. 5 Lakh – Rs. 10 Lakh</option>
                            <option value={99999999}>Above Rs. 10 Lakh</option>
                          </>
                        ) : (
                          <>
                            <option value={2500000}>Under Rs. 25 Lakh</option>
                            <option value={5000000}>Rs. 25 Lakh – Rs. 50 Lakh</option>
                            <option value={10000000}>Rs. 50 Lakh – Rs. 1 Crore</option>
                            <option value={30000000}>Rs. 1 Crore – Rs. 3 Crore</option>
                            <option value={50000000}>Rs. 3 Crore – Rs. 5 Crore</option>
                            <option value={100000000}>Rs. 5 Crore – Rs. 10 Crore</option>
                            <option value={99999999}>Above Rs. 10 Crore</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className=" flex flex-wrap items-center justify-center gap-3 my-8">

                    <a href="#featured" className="btn-accent gap-2 px-8">
                      <Search className="w-4 h-4" />
                      Search Properties
                    </a>
                  </div>

                  {error && (
                    <p className="mt-3 text-sm text-red-600 font-medium">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-white/40">
                <img
                  src={HERO_IMAGE}
                  alt="Modern home"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block card px-5 py-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Trusted listings
                </p>
                <p className="text-lg font-extrabold text-slate-900 mt-1">
                  {properties.length}+ properties
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900">
          Explore property related services
        </h2>
        <p className="text-center text-slate-500 mt-2">
          Everything you need to discover, compare, and find your next home.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          <ServiceCard
            title="Home Loans"
            icon={Home}
            desc="Estimate payments and compare offers."
            onClick={handleModal}
          />
          <ServiceCard
            title="Investment Hotspots"
            icon={TrendingUp}
            desc="Find neighborhoods with strong demand."
            onClick={() => setShowHotspots(true)}

          />

          <ServiceCard
            title="Rates & Trends"
            icon={LineChart}
            desc="Track market rent and price movements."
            onClick={() => setShowRates(true)}
          />
        </div>
      </section>

      {/* Types */}
      <section className="bg-white">
        <div className="container-page py-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900">
            We&apos;ve got properties for everyone
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TypeTile title="Apartments" count={typeCounts.APARTMENT ?? 0} />
            <TypeTile title="Houses" count={typeCounts.HOUSE ?? 0} />
            <TypeTile title="Commercial" count={typeCounts.COMMERCIAL ?? 0} />
            <TypeTile title="Land" count={typeCounts.LAND ?? 0} />
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section id="featured" className="container-page py-14">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Properties for {activeTab === "RENT" ? "Rent" : "Sale"}
              </h2>
              <p className="text-slate-500 mt-2">
                Verified listings from our premium network.
              </p>
            </div>
          </div>

          {user?.role !== "LANDLORD" && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("RENT");
                  if (maxPrice > 10000) setMaxPrice(5000);
                }}
                className={`px-6 py-2.5 rounded-xl transition-all font-bold ${activeTab === "RENT"
                  ? "bg-[#e51013] text-white shadow-lg shadow-red-500/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
              >
                For Rent
              </button>
              <button
                onClick={() => {
                  setActiveTab("SALE");
                  if (maxPrice < 10000) setMaxPrice(10000000);
                }}
                className={`px-6 py-2.5 rounded-xl transition-all font-bold ${activeTab === "SALE"
                  ? "bg-[#e51013] text-white shadow-lg shadow-red-500/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
              >
                For Sale
              </button>
            </div>
          )}
        </div>

        <div>
          {loading ? (
            <div className="mt-10 card p-10 text-center text-slate-500 font-medium">
              Loading properties…
            </div>
          ) : featured.length === 0 ? (
            <div className="mt-10 card p-10 text-center">
              <p className="text-slate-600 font-medium">
                No matching listings found.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Try a different location, type, or price.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <PropertyCard key={p.id} p={p} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${page === i + 1
                          ? "bg-[#e51013] text-white shadow-lg shadow-red-500/20"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Modal renders here ── */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Home Loan Calculator" subTitle="calulate your estimated home loans" children={<HomeLoansCalculator />} />
      <Modal open={showRates} onClose={() => setShowRates(false)} title="Rates and Trends" subTitle="Track market rent and price movement" children={<RatesTrends properties={properties} />} />
      <Modal open={showHotspots} onClose={() => setShowHotspots(false)} title="Investment Hotspots" subTitle="Areas with strong investment potential" children={<InvestmentHotspots properties={properties} />} />

    </div>
  );
}

function ServiceCard({
  title,
  desc,
  icon: Icon,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <div
      className={`card p-6 hover:border-slate-200 hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""
        }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mt-4 font-extrabold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function TypeTile({ title, count }: { title: string; count: number }) {
  return (
    <div className="card p-6 flex items-center justify-between">
      <div>
        <p className="text-4xl font-extrabold text-[#60a5fa] leading-none">
          {count}
        </p>
        <p className="mt-2 text-sm font-bold text-slate-600">{title}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100" />
    </div>
  );
}