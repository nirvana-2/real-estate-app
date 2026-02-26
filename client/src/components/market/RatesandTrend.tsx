import { TrendingUp, TrendingDown, Home, Building2, Trees, Store } from "lucide-react";

interface Property {
  price: number;
  propertyType: string;
  listingType: string;
  available: boolean;
}

interface RatesTrendsProps {
  properties: Property[];
}

export const RatesTrends = ({ properties }: RatesTrendsProps) => {
  // Helper — average price for a type and listing
  const avgPrice = (type: string, listing: string) => {
    const filtered = properties.filter(
      (p) => p.propertyType === type && p.listingType === listing
    );
    if (filtered.length === 0) return null;
    const avg = filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length;
    return Math.round(avg);
  };

  // Helper — count for a type
  const countByType = (type: string) =>
    properties.filter((p) => p.propertyType === type).length;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(n);

  const rentTypes = [
    { label: "Apartment", type: "APARTMENT", icon: Building2 },
    { label: "House",     type: "HOUSE",     icon: Home },
    { label: "Land",      type: "LAND",      icon: Trees },
    { label: "Commercial",type: "COMMERCIAL",icon: Store },
  ];

  const totalListings  = properties.length;
  const availableCount = properties.filter((p) => p.available).length;
  const rentedCount    = totalListings - availableCount;
  const occupancyRate  = totalListings > 0 ? Math.round((rentedCount / totalListings) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-2xl font-black text-slate-900">{totalListings}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
            Total Listings
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-2xl font-black text-emerald-600">{availableCount}</p>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mt-1">
            Available
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <p className="text-2xl font-black text-[#e51013]">{occupancyRate}%</p>
          <p className="text-[10px] font-bold text-red-300 uppercase tracking-wide mt-1">
            Occupancy
          </p>
        </div>
      </div>

      {/* Rent Prices by Type */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Average Rent Price by Type
        </p>
        <div className="space-y-2">
          {rentTypes.map(({ label, type, icon: Icon }) => {
            const avg = avgPrice(type, "RENT");
            const count = countByType(type);
            return (
              <div
                key={type}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#e51013]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{count} listings</p>
                  </div>
                </div>
                <div className="text-right">
                  {avg ? (
                    <>
                      <p className="text-sm font-black text-slate-900">{fmt(avg)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">per month</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-300 font-medium">No data</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sale Prices by Type */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Average Sale Price by Type
        </p>
        <div className="space-y-2">
          {rentTypes.map(({ label, type, icon: Icon }) => {
            const avg = avgPrice(type, "SALE");
            return (
              <div
                key={type}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                  </div>
                </div>
                <div className="text-right">
                  {avg ? (
                    <p className="text-sm font-black text-slate-900">{fmt(avg)}</p>
                  ) : (
                    <p className="text-xs text-slate-300 font-medium">No data</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Listings by Type
        </p>
        <div className="space-y-2">
          {rentTypes.map(({ label, type }) => {
            const count = countByType(type);
            const percent = totalListings > 0 ? (count / totalListings) * 100 : 0;
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>{label}</span>
                  <span>{count} listings</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-[#e51013] h-2 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Insight */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
        <span className="text-base">📊</span>
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Data is based on current listings in our platform. Prices may vary based on location and amenities.
        </p>
      </div>

      {/* Trend indicators */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-700">Rent Market</p>
            <p className="text-[10px] text-emerald-500 font-medium">High demand this season</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-orange-700">Sale Market</p>
            <p className="text-[10px] text-orange-400 font-medium">Prices stabilizing</p>
          </div>
        </div>
      </div>

    </div>
  );
};
