import { api } from "../api/axios";
import type { Application, ApplicationsResponse } from "../auth-types/application.types";

// Response wrapper to match your res.json({ application })
interface SingleApplicationResponse {
  message: string;
  application: Application;
}

/**
 * 1. Tenant: Submit an application
 * POST /applications
 */
export const createApplication = async (propertyId: number, message: string, moveInDate: string): Promise<SingleApplicationResponse> => {
  const res = await api.post<SingleApplicationResponse>("/applications", { propertyId, message, moveInDate });
  return res.data;
};

/**
 * 2. Tenant: Get all own applications
 * GET /applications/my
 */
export const getMyApplications = async (page = 1, limit = 10): Promise<ApplicationsResponse> => {
  const res = await api.get<ApplicationsResponse>(`/applications/my?page=${page}&limit=${limit}`);
  return res.data;
};

/**
 * 3. Landlord: Get applications for their properties
 * GET /applications/property
 */
export const getPropertyApplications = async (page = 1, limit = 10): Promise<ApplicationsResponse> => {
  const res = await api.get<ApplicationsResponse>(`/applications/property?page=${page}&limit=${limit}`);
  return res.data;
};

/**
 * 4. Admin: Get all applications
 * GET /applications/all
 */
export const getAllApplicationsAdmin = async (page = 1, limit = 10): Promise<ApplicationsResponse> => {
  const res = await api.get<ApplicationsResponse>(`/applications/all?page=${page}&limit=${limit}`);
  return res.data;
};

/**
 * 5. Landlord/Admin: Update application status
 * PUT /applications/:id/status (landlord)
 */
export const updateApplicationStatus = async (
  id: number,
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
): Promise<SingleApplicationResponse> => {
  const res = await api.put<SingleApplicationResponse>(`/applications/${id}/status`, { status });
  return res.data;
};