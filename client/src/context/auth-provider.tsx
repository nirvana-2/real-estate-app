import React, { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import type { currentUser, LoginPayload, RegisterPayload } from "../auth-types/auth.types";
import { getMe, loginUser, logoutUser, registerUser } from "../services/auth.service";
import { authToken } from "../api/axios";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<currentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authToken.get();
        if (!token) {
          setUser(null);
          return;
        }
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        console.log("error is", error);
        setUser(null);
        authToken.clear();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // FIX: Explicitly set return type to Promise<currentUser>
  const login = async (data: LoginPayload): Promise<currentUser> => {
    try {
      const response = await loginUser(data); 
      authToken.set(response.token);
      setUser(response.user); 
      // LOGIC: Return the user so LoginPage can read the role
      return response.user; 
    } catch (error) {
      console.error("Login logic error:", error);
      throw error;
    }
  };

  // FIX: Explicitly set return type to Promise<currentUser>
  const register = async (data: RegisterPayload): Promise<currentUser> => {
    try {
      const response = await registerUser(data);
      authToken.set(response.token);
      setUser(response.user);
      // LOGIC: Return the user so the UI can redirect based on role
      return response.user;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      authToken.clear();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};