import  express  from "express";
import { protect } from "../middlewares/auth";
import { authorize } from "../middlewares/role";
import {getMyProperties,addProperty,updateProperty,deleteProperty,getApplicationsForProperty} from "../controllers/landlord.controller";
const router=express.Router();
//routes
router.post("/landlord/property",protect,authorize("LANDLORD"),addProperty);
router.get("/landlord/properties",protect,authorize('LANDLORD'),getMyProperties);
router.put("/landlord/property/:id", protect, authorize("LANDLORD"), updateProperty); 
router.delete("/landlord/property/:id", protect, authorize("LANDLORD"), deleteProperty); 
router.get("/landlord/property/:propertyId/applications", protect, authorize("LANDLORD"), getApplicationsForProperty);
export default router;