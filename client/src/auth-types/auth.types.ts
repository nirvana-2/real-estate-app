export type Role = "ADMIN" | "LANDLORD" | "TENANT";
export type AgentSpecialty = "LUXURY" | "RESIDENTIAL" | "COMMERCIAL" | "NEW_CONSTRUCTION";

export interface currentUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  isAgent: boolean;
  agentBio?: string;
  agentPhone?: string;
  agentPhoto?: string;
  specialty?: AgentSpecialty;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface currentUserResponse {
  user: currentUser;
  token: string;
}

export interface AuthContextType {
  user: currentUser | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<currentUser>;
  register: (data: RegisterPayload) => Promise<currentUser>;
  logout: () => Promise<void>;
}