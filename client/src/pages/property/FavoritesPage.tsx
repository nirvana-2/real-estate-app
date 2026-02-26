import { useEffect, useState } from "react";
import { PropertyCard } from "../../components/property/PropertyCard";
import { getMyFavorites } from "../../services/favorite.service";
import type { Property } from "../../auth-types/property.types";
import { Heart, Home, Loader2 } from "lucide-react";

const FavoritesPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getMyFavorites();
                // Safety filter to prevent crashes if property is missing
                const validProperties = data.favorites
                    .filter(f => f && f.property)
                    .map(f => f.property);
                setProperties(validProperties);
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#e51013] animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#e51013] fill-[#e51013]" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Favorites</h1>
                    <p className="text-slate-500 font-medium">Properties you've saved for later.</p>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Home className="w-8 h-8 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h2>
                    <p className="text-slate-500 max-w-xs mx-auto mb-6">Start browsing properties and click the heart icon to save them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map(p => (
                        <PropertyCard key={p.id} p={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
