// src/routes/bookingRoutes.ts
import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getPropertyBookings,
  getAllBookings,
  updateBookingStatus
} from "../controllers/booking.controller";
import {protect} from "../middlewares/auth";
import {authorize} from "../middlewares/role";

const router = Router();

// Tenant routes
router.post("/", protect, authorize("TENANT"), createBooking);
router.get("/my", protect, authorize("TENANT"), getMyBookings);

// Landlord routes
router.get("/property", protect, authorize("LANDLORD"), getPropertyBookings);

// Admin routes
router.get("/all", protect, authorize("ADMIN"), getAllBookings);
router.patch("/:id/status", protect, authorize("LANDLORD"), updateBookingStatus);

export default router;
