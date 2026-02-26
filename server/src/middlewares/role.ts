import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth";
import { Role } from "@prisma/client";

export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" })
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" })
      }
  
      next()
    }
  }
  