import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import type { User } from "@prisma/client";

interface CustomJwtPayload {
  id: number
}

export interface AuthRequest extends Request {
  user: User  // ✅ use the full Prisma User type instead of custom object
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(
        token!,
        process.env.JWT_SECRET!
      ) as unknown as CustomJwtPayload

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      })

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      req.user = user
      next()
    } else {
      return res.status(401).json({ message: "Not authorized, no token" })
    }
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" })
  }
}