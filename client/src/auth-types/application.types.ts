export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Application {
  id: number;
  message: string;
  status: ApplicationStatus;
  propertyId: number;
  tenantId: number;
  createdAt: string;
  moveInDate?: string;

  property?: {
    id: number;
    title: string;
    location: string;
    price: number;
  };
  tenant?: {
    name: string;
    email: string;
  };
}

export interface ApplicationsResponse {
  applications: Application[];
  total?: number;
  page?: number;
  totalPages?: number;
}