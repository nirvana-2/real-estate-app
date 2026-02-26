// src/controllers/applicationController.ts
import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";

// 1. Tenant: Submit an application for a property
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, message, moveInDate } = req.body;

    const application = await prisma.application.create({
      data: {
        tenant: { connect: { id: req.user.id } },
        property: { connect: { id: Number(propertyId) } },
        message,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        status: "PENDING",
      },
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// 2. Tenant: Get all own applications
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { tenantId: req.user.id },
        include: {
          property: { select: { title: true, location: true, price: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({
        where: { tenantId: req.user.id },
      }),
    ]);

    res.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your applications" });
  }
};

// 3. Landlord: Get applications for their properties
export const getPropertyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { property: { landlordId: req.user.id } },
        include: {
          tenant: { select: { name: true, email: true } },
          property: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({
        where: { property: { landlordId: req.user.id } },
      }),
    ]);

    res.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property applications" });
  }
};

// 4. Admin: Get all applications
export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        include: {
          tenant: { select: { name: true } },
          property: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count(),
    ]);

    res.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all applications" });
  }
};

// 5. Landlord/Admin: Update application status
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to update application status" });
  }
};
