import { api } from "../api/axios";
import type { Property } from "../auth-types/property.types";

interface FavoritesResponse {
    favorites: {
        id: number;
        property: Property;
    }[];
}

export const getMyFavorites = async (): Promise<FavoritesResponse> => {
    const res = await api.get<FavoritesResponse>("/favorites/my");
    return res.data;
};

export const addFavorite = async (propertyId: number) => {
    const res = await api.post("/favorites", { propertyId });
    return res.data;
};

export const removeFavorite = async (propertyId: number) => {
    const res = await api.delete(`/favorites/property/${propertyId}`);
    return res.data;
};
