// src/controllers/paymentController.ts
import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";

// 1. Tenant: Make a payment
export const makePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, amount, currency, paymentType } = req.body;

    const payment = await prisma.payment.create({
      data: {
        tenantId: req.user.id,
        propertyId,
        amount,
        currency,
        paymentType,
        status: "PENDING", // default, can later be updated to SUCCESS/FAILED
      },
    });

    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment" });
  }
};

// 2. Tenant: View own payments
export const getMyPayments = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { tenantId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

// 3. Landlord: View payments for their properties
export const getPropertyPayments = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { property: { landlordId: req.user.id } },
      include: {
        tenant: { select: { name: true, email: true } },
        property: { select: { title: true, location: true } },
      },
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property payments" });
  }
};

// 4. Admin: View all payments
export const getAllPayments = async (_req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        tenant: { select: { name: true } },
        property: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all payments" });
  }
};

// 5. Admin: Update payment status (e.g., mark SUCCESS/FAILED)
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: "Payment status updated", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status" });
  }
};
