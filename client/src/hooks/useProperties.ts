import { useState, useEffect, useCallback } from "react";
import type { Property, PropertiesResponse } from "../auth-types/property.types";
import { getAllPropertiesAdmin, getMyPropertiesLandlord } from "../services/property.service";
import { useAuth } from "./useAuth";
import axios from "axios";
import { api } from "../api/axios";

export interface UsePropertiesOptions {
  scope?: 'public' | 'my' | 'all';
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minArea?: number;
    maxArea?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
    minFloors?: number;
    maxFloors?: number;
  };
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const { scope = 'public', page = 1, limit = 8, filters } = options;

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      // 1. If scope is 'all' (Admin view)
      if (scope === 'all' && user?.role === 'ADMIN') {
        data = await getAllPropertiesAdmin(page, limit);
      }
      // 2. If scope is 'my' (Landlord inventory view)
      else if (scope === 'my' && user?.role === 'LANDLORD') {
        data = await getMyPropertiesLandlord(page, limit);
      }
      // 3. Default: 'public' marketplace view (Home, Rent, Buy pages)
      else {
        const res = await api.get<PropertiesResponse>("/properties/public", {
          params: {
            page,
            limit,
            ...filters,
          },
        });
        data = res.data;
      }

      setProperties(data.properties);
      if (data.page !== undefined) {
        setPagination({
          total: data.total || 0,
          page: data.page,
          totalPages: data.totalPages || 1,
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load properties");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.role, scope, page, limit, JSON.stringify(filters)]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refresh: fetchProperties, pagination };
};