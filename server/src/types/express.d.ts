import { User, Role } from "@prisma/client";

export interface AuthUser {
  id: number;
  role: Role;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export {};
