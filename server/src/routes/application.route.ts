// src/routes/applicationRoutes.ts
import { Router } from "express";
import {
  createApplication,
  getMyApplications,
  getPropertyApplications,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";
import {protect} from "../middlewares/auth";
import {authorize} from "../middlewares/role";

const router = Router();

// Tenant routes
router.post("/", protect, authorize("TENANT"), createApplication);
router.get("/my", protect, authorize("TENANT"), getMyApplications);

// Landlord routes
router.get("/property", protect, authorize("LANDLORD"), getPropertyApplications);
router.put("/:id/status", protect, authorize("LANDLORD"), updateApplicationStatus);

// Admin routes
router.get("/all", protect, authorize("ADMIN"), getAllApplications);
router.put("/:id/status/admin", protect, authorize("ADMIN"), updateApplicationStatus);

export default router;
