import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    if (!roles.includes(req.user.role as Role)) {  // ✅ cast to Role
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  }
}