import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Property } from "../../auth-types/property.types";
import { getImageUrl } from "../../utils/url.utils";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";

const formatMoney = (n: number) => {
    if (!Number.isFinite(n)) return "$0";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
};

export const PropertyCard: React.FC<{ p: Property }> = ({ p }) => {
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    if (!p) return null;
    const image = getImageUrl(p.images?.[0]);
    const active = isFavorite(p.id);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(p.id);
    };

    return (
        <Link to={`/property/${p.id}`} className="card overflow-hidden group hover:shadow-lg hover:border-slate-200 transition-all relative">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-extrabold text-[#e51013] shadow-sm">
                    {p.listingType === "RENT" ? "For Rent" : "For Sale"}
                </div>

                {user?.role === "TENANT" && (
                    <button
                        onClick={handleFavorite}
                        className={`absolute top-3 right-3 p-2 rounded-xl transition-all ${active ? "bg-[#e51013] text-white shadow-lg shadow-red-500/30" : "bg-white/80 text-slate-400 hover:text-[#e51013] backdrop-blur"
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
                    </button>
                )}
            </div>
            <div className="p-5">
                <h3 className="font-extrabold text-slate-900 line-clamp-1">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{p.location}</p>
                {p.landlord?.name && (
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                        {p.listingType === "RENT" ? "For rent by" : "For sale by"} {p.landlord.name}
                    </p>
                )}
                <p className="mt-3 text-xl font-extrabold text-[#e51013]">
                    {formatMoney(p.price)}
                    {p.listingType === "RENT" && <span className="text-xs text-slate-400 font-bold ml-1">/mo</span>}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <div className="bg-slate-50 rounded-lg px-2 py-1 text-center font-bold">{p.bedrooms} bd</div>
                    <div className="bg-slate-50 rounded-lg px-2 py-1 text-center font-bold">{p.bathrooms} ba</div>
                    <div className="bg-slate-50 rounded-lg px-2 py-1 text-center font-bold">{Math.round(p.areaSqFt)} ft²</div>
                </div>
            </div>
        </Link>
    );
};
