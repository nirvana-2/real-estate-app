export interface AgentPublicProfile {
    id: number;
    name: string;
    email: string;
    agentBio: string | null;
    agentPhone: string | null;
    agentPhoto: string | null;
    specialty: 'LUXURY' | 'RESIDENTIAL' | 'COMMERCIAL' | 'NEW_CONSTRUCTION' | null;
    activeListings: number; // from _count.properties
}

export interface AgentsResponse {
    agents: AgentPublicProfile[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
