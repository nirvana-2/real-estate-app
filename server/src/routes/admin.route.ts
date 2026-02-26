import express from "express";
import {protect} from "../middlewares/auth";
import {authorize} from "../middlewares/role";
import{getAllUser,getUserByID,updateUser,updateUserRoles,deleteUser}from "../controllers/admin.controller";

const router=express.Router();
//routes
router.get("/admin/users",protect,authorize("ADMIN"),getAllUser)
router.get("/admin/users/:id",protect,authorize("ADMIN"),getUserByID)
router.put("/admin/user/:id",protect,authorize("ADMIN"),updateUser)
router.put("/admin/user/:id/role",protect,authorize("ADMIN"),updateUserRoles)
router.delete("/admin/user/:id",protect,authorize("ADMIN"),deleteUser)

export default router;
