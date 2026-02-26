// src/controllers/propertyController.ts
import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";
import type { Request } from "express";

// 1. Landlord: Create a property
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      price,
      available,
      propertyType,
      bedrooms,
      bathrooms,
      areaSqFt,
      images,
      listingType,
      latitude,
      longitude,
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        price,
        available,
        propertyType,
        bedrooms,
        bathrooms,
        areaSqFt,
        images,
        listingType,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        landlord: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json({ message: "Property created", property });
  } catch (error) {
    console.error("Property creation error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

// 2. Landlord: Update property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      price,
      available,
      propertyType,
      bedrooms,
      bathrooms,
      areaSqFt,
      images,
      listingType,
      latitude,
      longitude,
    } = req.body;

    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        location,
        price,
        available,
        propertyType,
        bedrooms,
        bathrooms,
        areaSqFt,
        images,
        listingType,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    res.json({ message: "Property updated", property });
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

// 3. Landlord: Delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.property.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// 4. Tenant: Browse all available properties
export const getAllProperties = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        include: {
          landlord: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.property.count(),
    ]);

    res.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// 4b. Public: Browse available properties (no auth)
export const getPublicProperties = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { search, propertyType, listingType, minPrice, maxPrice } = req.query;

    const where: any = {
      available: true,
      ...(search && {
        OR: [
          { title: { contains: String(search), mode: "insensitive" } },
          { location: { contains: String(search), mode: "insensitive" } },
        ],
      }),
      ...(propertyType && propertyType !== "ALL" && {
        propertyType: String(propertyType),
      }),
      ...(listingType && listingType !== "ALL" && {
        listingType: String(listingType),
      }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      }),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          landlord: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// 5b. Public: View single property detail (no auth)
export const getPublicPropertyDetail = async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(req.params.id) },
      include: { landlord: { select: { name: true, email: true } } },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ property });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property details" });
  }
};

// 5. Tenant: View single property detail
export const getPropertyDetail = async (req: AuthRequest, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(req.params.id) },
      include: { landlord: { select: { name: true, email: true } } },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ property });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property details" });
  }
};

// 6. Admin: View all properties (including unavailable)
export const getAllPropertiesAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        include: {
          landlord: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.property.count(),
    ]);

    res.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all properties" });
  }
};

// 7. Tenant: Apply and Book in a single transaction
export const applyAndBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id: propertyId } = req.params;
    const { message, tourDate, moveInDate } = req.body;

    if (!tourDate) {
      return res.status(400).json({ message: "Tour date is required" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Application
      const application = await tx.application.create({
        data: {
          tenant: { connect: { id: req.user.id } },
          property: { connect: { id: Number(propertyId) } },
          message,
          moveInDate: moveInDate ? new Date(moveInDate) : null,
          status: "PENDING",
        },
      });

      // 2. Create Booking
      const booking = await tx.booking.create({
        data: {
          tenantId: req.user.id,
          propertyId: Number(propertyId),
          date: new Date(tourDate),
          status: "PENDING",
        },
      });

      return { application, booking };
    });

    res.status(201).json({
      message: "Application and Tour Request sent successfully!",
      ...result,
    });
  } catch (error) {
    console.error("Apply and Book error:", error);
    res.status(500).json({
      message: "Failed to process application and booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};