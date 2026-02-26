import { useContext } from "react";
// FIX: Point to the actual context definition file in your context folder
import { AuthContext } from "../context/auth-context"; 
import type { AuthContextType } from "../auth-types/auth.types";

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    // Logic: This error triggers if you try to use useAuth 
    // in a component that isn't wrapped by <AuthProvider> in main.tsx
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};