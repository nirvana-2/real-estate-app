import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";
import type { Property } from "@prisma/client";
//to add a new property
export const addProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property: Property = await prisma.property.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        propertyType: req.body.propertyType,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        areaSqFt: req.body.areaSqFt,
        amenities: req.body.amenities,
        landlordId: req.user.id,
      },
    })
    res.status(201).json({ property })
  } catch (error) {
    res.status(500).json({ message: "Failed to add property" });
  }
}
//to get all property owned by landlord
export const getMyProperties = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: { landlordId: req.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.property.count({
        where: { landlordId: req.user.id },
      }),
    ]);

    res.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get property detail" });
  }
};
//update property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await prisma.property.update({
      where: { id: Number(req.params.id), landlordId: req.user.id },
      data: req.body,
    });
    res.json({ message: "Property updated", property });
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

// Delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.property.delete({
      where: { id: Number(req.params.id), landlordId: req.user.id },
    });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// View applications for a property
export const getApplicationsForProperty = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { propertyId: Number(req.params.propertyId) },
      include: { tenant: true },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};