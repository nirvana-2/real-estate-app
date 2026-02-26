import { api } from "../api/axios";
import type {
  Property,
  PropertiesResponse,
  SinglePropertyResponse
} from "../auth-types/property.types";

export const createProperty = async (data: Partial<Property>): Promise<SinglePropertyResponse> => {
  const res = await api.post<SinglePropertyResponse>("/properties", data);
  return res.data;
};

// 1a. Landlord: Upload Images
export const uploadPropertyImages = async (formData: FormData): Promise<{ urls: string[] }> => {
  const res = await api.post<{ urls: string[] }>("/properties/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// 2. Landlord: Update (owner-scoped)
export const updateProperty = async (id: number, data: Partial<Property>): Promise<SinglePropertyResponse> => {
  const res = await api.put<SinglePropertyResponse>(`/landlords/landlord/property/${id}`, data);
  return res.data;
};

// 3. Landlord: Delete (owner-scoped)
export const deleteProperty = async (id: number): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/landlords/landlord/property/${id}`);
  return res.data;
};

// 4. Tenant: Get Available
export const getAvailableProperties = async (page = 1, limit = 8): Promise<PropertiesResponse> => {
  const res = await api.get<PropertiesResponse>(`/properties?page=${page}&limit=${limit}`);
  return res.data;
};

// 4a. Public: Get Available
export const getPublicProperties = async (page = 1, limit = 8): Promise<PropertiesResponse> => {
  const res = await api.get<PropertiesResponse>(`/properties/public?page=${page}&limit=${limit}`);
  return res.data;
};

// 4b. Landlord: Get own properties
export const getMyPropertiesLandlord = async (page = 1, limit = 8): Promise<PropertiesResponse> => {
  const res = await api.get<PropertiesResponse>(`/landlords/landlord/properties?page=${page}&limit=${limit}`);
  return res.data;
};

// 5. Tenant: Get Detail
export const getPropertyDetail = async (id: number): Promise<SinglePropertyResponse> => {
  const res = await api.get<SinglePropertyResponse>(`/properties/${id}`);
  return res.data;
};

// 5a. Public: Get Detail
export const getPublicPropertyDetail = async (id: number): Promise<SinglePropertyResponse> => {
  const res = await api.get<SinglePropertyResponse>(`/properties/public/${id}`);
  return res.data;
};

// 6. Admin: Get All
export const getAllPropertiesAdmin = async (page = 1, limit = 8): Promise<PropertiesResponse> => {
  const res = await api.get<PropertiesResponse>(`/properties/all?page=${page}&limit=${limit}`);
  return res.data;
};