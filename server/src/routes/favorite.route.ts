// src/routes/favoriteRoutes.ts
import { Router } from "express";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../controllers/favorite.controller";
import { protect } from "../middlewares/auth";
import { authorize } from "../middlewares/role";

const router = Router();

// Tenant routes (User role = TENANT)
router.post("/", protect, authorize("TENANT"), addFavorite);
router.get("/my", protect, authorize("TENANT"), getMyFavorites);
router.delete("/property/:propertyId", protect, authorize("TENANT"), removeFavorite);

export default router;
