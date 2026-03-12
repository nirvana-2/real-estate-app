import { api } from "../api/axios";
import type { currentUser, AgentSpecialty } from "../auth-types/auth.types";

export interface AgentProfilePayload {
    isAgent?: boolean;
    agentBio?: string;
    agentPhone?: string;
    agentPhoto?: string;
    specialty?: AgentSpecialty;
}

export interface Agent extends currentUser {
    properties: { id: number }[];
}

export const getAgents = async (specialty?: string) => {
    const params = specialty && specialty !== "ALL" ? { specialty } : {};
    const response = await api.get<{ agents: Agent[] }>("/users/agents", { params });
    return response.data;
};

export const updateAgentProfile = async (data: AgentProfilePayload) => {
    const response = await api.patch<{ message: string; user: currentUser }>("/users/agent-profile", data);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get<currentUser>("/users/profile");
    return response.data;
};

// --- ADMIN METHODS ---
export const getAllUsersAdmin = async () => {
    const response = await api.get<{ user: currentUser[] }>("/admin/users");
    return response.data;
};

export const updateUserAdmin = async (id: number, data: Partial<currentUser>) => {
    const response = await api.put<{ user: currentUser }>(`/admin/user/${id}`, data);
    return response.data;
};

export const deleteUserAdmin = async (id: number) => {
    const response = await api.delete<{ message: string }>(`/admin/user/${id}`);
    return response.data;
};
