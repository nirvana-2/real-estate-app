import { MapPin, TrendingUp, Star, Building2 } from "lucide-react";

interface Property {
  price: number;
  propertyType: string;
  listingType: string;
  available: boolean;
  city?: string; // optional if you have it
}

interface InvestmentHotspotsProps {
  properties: Property[];
}

export const InvestmentHotspots = ({ properties }: InvestmentHotspotsProps) => {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(n);

  // 🧠 Group properties by propertyType (since city may not exist)
  const grouped = Object.values(
    properties.reduce((acc: any, property) => {
      const key = property.propertyType;

      if (!acc[key]) {
        acc[key] = {
          type: key,
          count: 0,
          totalPrice: 0,
          rentCount: 0,
        };
      }

      acc[key].count += 1;
      acc[key].totalPrice += property.price;

      if (property.listingType === "RENT") {
        acc[key].rentCount += 1;
      }

      return acc;
    }, {})
  );

  // 🎯 Compute investment metrics
  const hotspots = grouped
    .map((area: any) => {
      const avgPrice = area.totalPrice / area.count;

      // simple smart scoring
      const demandScore = area.count * 0.5;
      const rentScore = area.rentCount * 0.7;
      const investmentScore = Math.min(
        10,
        (demandScore + rentScore) / 2
      );

      return {
        ...area,
        avgPrice,
        investmentScore,
      };
    })
    .sort((a: any, b: any) => b.investmentScore - a.investmentScore)
    .slice(0, 4);

  const labelMap: Record<string, string> = {
    APARTMENT: "Apartment",
    HOUSE: "House",
    LAND: "Land",
    COMMERCIAL: "Commercial",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Investment Hotspots
        </p>
        <p className="text-sm text-slate-400 font-medium">
          Based on demand and rental activity.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotspots.map((spot: any) => (
          <div
            key={spot.type}
            className="bg-slate-50 rounded-xl p-4 border border-slate-100"
          >
            {/* Top */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#e51013]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {labelMap[spot.type] || spot.type}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {spot.count} listings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3 h-3" />
                {spot.investmentScore.toFixed(1)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Avg Price
                </p>
                <p className="text-sm font-black text-slate-900">
                  {fmt(Math.round(spot.avgPrice))}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Rental Demand
                </p>
                <p className="text-sm font-black text-emerald-600">
                  {spot.rentCount}
                </p>
              </div>
            </div>

            {/* Score bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Investment Score</span>
                <span>{Math.round(spot.investmentScore * 10)}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#e51013] h-2 rounded-full transition-all duration-700"
                  style={{ width: `${spot.investmentScore * 10}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
        <span className="text-base">💡</span>
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Hotspots are calculated from listing volume and rental activity on the platform.
        </p>
      </div>
    </div>
  );
};