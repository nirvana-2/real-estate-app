import type {Request,Response} from "express";
import prisma from "../utils/prisma";

//get all user
export const getAllUser= async(req:Request,res:Response)=>{
    try {
        const user= await prisma.user.findMany({
            select:{id:true,name:true,email:true,role:true,createdAt:true}
        });
        res.json({user}); 
    } catch (error) {
        res.status(500).json({message:"failed to fetch user"})
        
    }
}
//to get user by id
export const getUserByID=async(req:Request,res:Response)=>{
    try {
        const user=await prisma.user.findUnique({
            where:{id:Number(req.params.id)},
            select:{id: true, name: true, email: true, role: true, createdAt: true}
         });
         if (!user) return res.status(404).json({ message: "User not found" });
         res.json({user})
        
    } catch (error) {
        res.status(500).json({message:"failed to fetch user"})     
    }
}
//to update roles
export const updateUserRoles=async(req:Request,res:Response)=>{
    try {
        const{role}=req.body;
        const user= await prisma.user.update({
            where:{id:Number(req.params.id)},
            data:{role},
        });
        res.json({user})
    } catch (error) {
        res.status(500).json({message:"failed to update user role"})  
        
    }
}
//to update user(general fields)
export const updateUser=async(req:Request,res:Response)=>{
    try {
        const{name,email,role}=req.body;
        const user=await prisma.user.update({
            where:{id:Number(req.params.id)},
            data:{
                ...(name && { name }), ...(email && { email }), ...(role && { role })
            }
        });
        res.json({user})
    } catch (error) {
        res.status(500).json({message:"failed to update user "})  
    }
}
//to delete user
export const deleteUser=async(req:Request,res:Response)=>{
    try {
        await prisma.user.delete({where:{id:Number(req.params.id)}})
        res.json({message:"user deleted sucessfully"})
    } catch (error) {
        res.status(500).json({message:"failed to delete user"})  
    }
}