import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";
// get all properties(marketplace view)
export const getAllProperties=async(_req:AuthRequest,res:Response)=>{
    try {
        const properties=await prisma.property.findMany({
            where:{available:true},
            include:{
                landlord:{
                    select:{name:true,email:true}
                }
            }
        })
        res.json({properties})
        
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch properties" }); 
    }
}
//get single property detail
export const getPropertyDetail=async(req:AuthRequest,res:Response)=>{
    try {
        const property=await prisma.property.findUnique({
            where:{id:Number(req.params.id)},
            include:{landlord:{select:{name:true}}}
        })
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json({ property });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch property details" });  
    }
}
//get all application sent by tenants
export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            where: { tenantId: req.user.id },
            include: {
                property: {
                    include: {
                        landlord: { select: { name: true } }
                    }
                }
            }
        });
        res.json(applications);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your applications" });

    }
}

// Get tenant stats for dashboard
export const getTenantStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const [applicationsSent, savedListings, activeMessages] = await Promise.all([
            prisma.application.count({ where: { tenantId: userId } }),
            prisma.favorite.count({ where: { userId } }),
            prisma.message.count({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            })
        ]);

        res.json({
            applicationsSent,
            savedListings,
            activeMessages
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tenant stats" });
    }
};

// Get recommended properties
export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const limit = Number(req.query.limit) || 6;

        const properties = await prisma.property.findMany({
            where: { available: true },
            take: limit,
            include: {
                landlord: { select: { name: true } },
                favorites: {
                    where: { userId }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedProperties = properties.map(p => ({
            ...p,
            isSaved: p.favorites.length > 0
        }));

        res.json(formattedProperties);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch recommendations" });
    }
};

//get all bookings
// 4. Get all bookings (viewings) scheduled by this tenant
export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { tenantId: req.user.id },
            include: {
                property: {
                    select: { title: true, location: true }
                }
            }
        });
        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your bookings" });
    }
};

// 5. Get tenant's payment history
export const getMyPayments = async (req: AuthRequest, res: Response) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { tenantId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ payments });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch payment history" });
    }
};