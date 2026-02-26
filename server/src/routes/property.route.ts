// src/routes/propertyRoutes.ts
import { Router } from "express";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyDetail,
  getAllPropertiesAdmin,
  getPublicProperties,
  getPublicPropertyDetail,
  applyAndBook
} from "../controllers/property.controller";
import { protect } from "../middlewares/auth";
import { authorize } from "../middlewares/role";

import upload from "../middlewares/multerConfig";

const router = Router();

// Upload route
router.post("/upload", protect, authorize("LANDLORD"), upload.array("images", 10), (req: any, res: any) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const filePaths = (req.files as Express.Multer.File[]).map(
    (file) => `/uploads/${file.filename}`
  );

  res.status(200).json({ urls: filePaths });
});

// Public routes (must come before "/:id")
router.get("/public", getPublicProperties);
router.get("/public/:id", getPublicPropertyDetail);

// Admin routes (must come before "/:id")
router.get("/all", protect, authorize("ADMIN"), getAllPropertiesAdmin);

// Tenant routes
router.get("/", protect, authorize("TENANT"), getAllProperties);
router.post("/:id/apply-and-book", protect, authorize("TENANT"), applyAndBook);
router.get("/:id", protect, authorize("TENANT", "LANDLORD", "ADMIN"), getPropertyDetail);

// Landlord routes
router.post("/", protect, authorize("LANDLORD"), createProperty);
router.put("/:id", protect, authorize("LANDLORD"), updateProperty);
router.delete("/:id", protect, authorize("LANDLORD"), deleteProperty);

export default router;
