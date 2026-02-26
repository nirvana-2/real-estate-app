import { useState, useEffect, useCallback, useMemo } from "react";
import { getMyFavorites, addFavorite, removeFavorite } from "../services/favorite.service";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!user || user.role !== "TENANT") return;
        try {
            const data = await getMyFavorites();
            const validIds = (data.favorites || [])
                .filter(f => f && f.property)
                .map(f => f.property.id);
            setFavorites(validIds);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const toggleFavorite = async (propertyId: number) => {
        if (!user) return;
        setLoading(true);
        try {
            if (favorites.includes(propertyId)) {
                await removeFavorite(propertyId);
                setFavorites(prev => prev.filter(id => id !== propertyId));
            } else {
                await addFavorite(propertyId);
                setFavorites(prev => [...prev, propertyId]);
            }
        } catch (error) {
            console.error("Favorite toggle failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = useMemo(() => (id: number | undefined) => {
        if (!id) return false;
        return favorites.includes(id);
    }, [favorites]);

    return { favorites, toggleFavorite, isFavorite, loading, refresh: fetchFavorites };
};
