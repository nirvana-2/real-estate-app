import type { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getAgents = async (req: Request, res: Response) => {
    try {
        const { search, specialty, page = "1", limit = "10" } = req.query;
        const p = parseInt(page as string) || 1;
        const l = parseInt(limit as string) || 10;
        const skip = (p - 1) * l;

        const where: any = {
            role: "LANDLORD",
            isAgent: true,
        };

        if (specialty && specialty !== "ALL" && specialty !== "All") {
            where.specialty = specialty;
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: "insensitive" } },
                { agentBio: { contains: search as string, mode: "insensitive" } },
            ];
        }

        const [agentsRaw, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    agentBio: true,
                    agentPhone: true,
                    agentPhoto: true,
                    specialty: true,
                    _count: {
                        select: { properties: true },
                    },
                },
                skip,
                take: l,
                orderBy: { name: 'asc' }
            }),
            prisma.user.count({ where }),
        ]);

        const agents = agentsRaw.map((agent) => ({
            id: agent.id,
            name: agent.name,
            email: agent.email,
            agentBio: agent.agentBio,
            agentPhone: agent.agentPhone,
            agentPhoto: agent.agentPhoto,
            specialty: agent.specialty,
            activeListings: agent._count.properties,
        }));

        res.json({
            agents,
            pagination: {
                page: p,
                limit: l,
                total,
                totalPages: Math.ceil(total / l),
            },
        });
    } catch (error) {
        console.error("Error fetching agents:", error);
        res.status(500).json({ message: "Failed to fetch agents" });
    }
};
