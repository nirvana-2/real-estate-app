
import { Router } from "express";
import {
  getAllProperties,
  getPropertyDetail,
  getMyApplications,
  getMyBookings,
  getMyPayments,
  getTenantStats,
  getRecommendations,
} from "../controllers/tenants.controller";
import { protect } from "../middlewares/auth";   // authentication middleware
import { authorize } from "../middlewares/role"; // role-based middleware

const router = Router();

// Dashboard stats
router.get("/stats", protect, authorize("TENANT"), getTenantStats);

// Recommendations
router.get("/recommendations", protect, authorize("TENANT"), getRecommendations);

// Marketplace view: all available properties
router.get("/properties", protect, authorize("TENANT"), getAllProperties);

// Single property detail
router.get("/properties/:id", protect, authorize("TENANT"), getPropertyDetail);

// Tenant’s applications
router.get("/applications", protect, authorize("TENANT"), getMyApplications);

// Tenant’s bookings (viewings)
router.get("/bookings", protect, authorize("TENANT"), getMyBookings);

// Tenant’s payment history
router.get("/payments", protect, authorize("TENANT"), getMyPayments);

export default router;
