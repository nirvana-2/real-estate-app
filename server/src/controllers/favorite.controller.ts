// src/controllers/favoriteController.ts
import type { Response } from "express";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/auth";

// 1. User (Tenant): Add property to favorites
export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.body;

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        propertyId: Number(propertyId),
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        user: { connect: { id: req.user.id } },
        property: { connect: { id: Number(propertyId) } },
      },
    });

    res.status(201).json({ message: "Property added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// 2. User (Tenant): Get all favorites
export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        property: true, // Include full property details
      },
    });

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// 3. User (Tenant): Remove property from favorites
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        propertyId: Number(propertyId)
      },
    });

    res.json({ message: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};
