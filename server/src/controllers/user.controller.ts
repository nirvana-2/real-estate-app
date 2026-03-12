import type { Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get current user's profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        isAgent: true, agentBio: true, agentPhone: true, agentPhoto: true, specialty: true
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update current user's profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(email && { email }) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

// Delete account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// ✅ Get all public agents (no auth required)
export const getAgents = async (req: Request, res: Response) => {
  try {
    const { specialty } = req.query;

    const agents = await prisma.user.findMany({
      where: {
        role: "LANDLORD" as const,
        isAgent: true,
        ...(specialty && specialty !== "ALL" ? { specialty: specialty as any } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        agentBio: true,
        agentPhone: true,
        agentPhoto: true,
        specialty: true,
        properties: {
          select: { id: true },
          where: { available: true },
        },
      },
    });

    res.json({ agents });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch agents" });
  }
};

// ✅ Update agent profile (landlord only)
export const updateAgentProfile = async (req: Request, res: Response) => {
  try {
    if (req.user.role !== "LANDLORD") {
      return res.status(403).json({ message: "Only landlords can become agents" });
    }

    const { isAgent, agentBio, agentPhone, agentPhoto, specialty } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isAgent,
        agentBio,
        agentPhone,
        agentPhoto,
        specialty,
      },
      select: {
        id: true, name: true, isAgent: true,
        agentBio: true, agentPhone: true, agentPhoto: true, specialty: true,
      },
    });

    res.json({ message: "Agent profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update agent profile" });
  }
};