import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { AgentPublicProfile, AgentsResponse } from '../types/agent';

interface UseAgentsProps {
    search?: string;
    specialty?: string;
    page?: number;
    limit?: number;
}



export const useAgents = (props: UseAgentsProps = {}) => {
    const { search, specialty, page = 1, limit = 12 } = props;
    const [agents, setAgents] = useState<AgentPublicProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const response = await api.get<AgentsResponse>('/api/agents', {
                    params: {
                        search,
                        specialty: specialty === 'All' ? undefined : specialty,
                        page,
                        limit,
                    },
                });

                setAgents(response.data.agents);
                setPagination(response.data.pagination);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching agents:', err);
                setError(err.response?.data?.message || 'Failed to fetch agents');
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [search, specialty, page, limit]);

    return { agents, loading, error, pagination };
};
