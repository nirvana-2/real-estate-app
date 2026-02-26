// src/controllers/booking.controller.ts
import type { Response, Request } from "express";
import prisma from "../utils/prisma";

// 1. Tenant: Create a booking (schedule a viewing)
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { propertyId, date } = req.body;

    if (!propertyId || !date) {
      return res.status(400).json({ message: "Property ID and Date are required" });
    }

    const booking = await prisma.booking.create({
      data: {
        tenantId: Number(req.user.id),
        propertyId: Number(propertyId), 
        date: new Date(date), 
        status: "PENDING" 
      },
    });

    return res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("PRISMA ERROR DETAILS:", error); 
    return res.status(500).json({ 
      message: "Failed to create booking",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 2. Tenant: Get all own bookings
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { tenantId: req.user.id },
      include: {
        property: { select: { title: true, location: true, images: true } },
      },
      orderBy: { date: "asc" },
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
};

// 3. Landlord: Get bookings for their properties
export const getPropertyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { property: { landlordId: req.user.id } },
      include: {
        tenant: { select: { name: true, email: true } },
        property: { select: { title: true, location: true, images: true } },
      },
      orderBy: { date: "asc" },
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property bookings" });
  }
};

// 4. Admin: Get all bookings
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        tenant: { select: { name: true } },
        property: { select: { title: true, location: true } },
      },
      orderBy: { date: "asc" },
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};

// 5. Landlord: Update booking status (PATCH /bookings/:id/status)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body; 
    const userId = req.user.id;

    // Manual role check (RBAC)
    if (req.user.role !== "LANDLORD") {
      return res.status(403).json({ message: "Restricted to Landlord role only" });
    }

    // 1. Find the booking record and include the property to check ownership
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        property: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking record missing" });
    }

    // 2. Manual Ownership Check: Ensure landlordId of the associated property matches req.user.id
    if (booking.property.landlordId !== userId) {
      return res.status(403).json({ message: "Access denied: You do not own the property associated with this booking" });
    }

    // 3. Update the status and/or date
    const updateData: any = {};
    if (status) updateData.status = status;
    if (date) updateData.date = new Date(date);

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return res.status(200).json({
      message: `Booking status updated to ${status} successfully`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
