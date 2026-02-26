// src/routes/paymentRoutes.ts
import { Router } from "express";
import {
  makePayment,
  getMyPayments,
  getPropertyPayments,
  getAllPayments,
  updatePaymentStatus,
} from "../controllers/payment.controller";
import {protect} from "../middlewares/auth";
import {authorize} from "../middlewares/role";

const router = Router();

// Tenant routes
router.post("/", protect, authorize("TENANT"), makePayment);
router.get("/my", protect, authorize("TENANT"), getMyPayments);

// Landlord routes
router.get("/property", protect, authorize("LANDLORD"), getPropertyPayments);

// Admin routes
router.get("/all", protect, authorize("ADMIN"), getAllPayments);
router.put("/:id/status", protect, authorize("ADMIN"), updatePaymentStatus);

export default router;
