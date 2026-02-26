import type { Request, Response } from "express";
import prisma from "../utils/prisma"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { Role } from "@prisma/client";

//to generate token
const generateToken =(id:number,role:Role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET!,{expiresIn:"3d"}

    );
};
//to register user
export const register=async(req:Request,res:Response)=>{
    try {
        const{name,email,password,role}=req.body;
        // to check whether user exist
        const existing=await prisma.user.findUnique({where :{email}});
        if(existing)return res.status(400).json({message:"user already registered"});

        const hashedPassword=await bcrypt.hash(password,10);
        const user= await prisma.user.create({
           data:{name,email,password:hashedPassword,role:role as Role}
        })
         const token = generateToken(user.id,user.role);
         res.status(201).json({token,user})
    } catch (error) {
        res.status(500).json({message:"registration failed"})
    }
}
//to login user
export const login=async(req:Request,res:Response)=>{
    try {
        const{email,password}=req.body
        const user=await prisma.user.findUnique({where:{email}});
        if (!user)
          {return res.status(401).json({ message: "Invalid credentials" }); }
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) 
          {return res.status(401).json({ message: "Invalid credentials" }); }
        const token=generateToken(user.id,user.role);
        res.json({token,user})

    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
}
//logout
export const logout = (_req: Request, res: Response) => 
    { res.json({ message: "Logged out successfully" }); };
//to change password
export const changePassword = async (req: Request, res: Response) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
  
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update password" });
    }
  };
  export const getMe = async (req: Request, res: Response) => {
    res.json({ user: req.user });
  };
  