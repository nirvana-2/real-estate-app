import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, Home, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import type { Role } from "../../auth-types/auth.types";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(formData);
      const origin = location.state?.from?.pathname;

      if (origin) {
        navigate(origin, { replace: true });
      } else {
        switch (user.role as Role) {
          case "ADMIN":
            navigate("/admin/applications");
            break;
          case "LANDLORD":
            navigate("/landlord/dashboard");
            break;
          case "TENANT":
            navigate("/");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid credentials");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1470"
          alt="Modern Home"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-10000 ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-2">
            <div className="bg-[#e51013] p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">RealEstate</span>
          </div>

          <div>
            <h2 className="text-5xl font-black leading-tight mb-6">
              Find your <br />
              <span className="text-[#e51013]">dream home</span> <br />
              today.
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Access the most exclusive listings and manage your property journey with ease.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <span>© 2026 RealEstate Inc.</span>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white py-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden mb-12">
            <div className="bg-[#e51013] p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">RealEstate</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3">Welcome back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 text-[#e51013] border border-red-100 rounded-xl px-4 py-3.5 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e51013]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="input pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="#" className="text-xs font-bold text-[#e51013] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input pl-12"
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-accent w-full group py-4">
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? "Signing in..." : "Sign In"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="pt-6 border-t border-slate-100 mt-8 text-center">
              <p className="text-sm text-slate-500 font-medium font-inter">
                Don't have an account?{" "}
                <Link className="font-bold text-[#e51013] hover:underline px-1 py-0.5 rounded-md hover:bg-red-50 transition-colors" to="/register">
                  Create one for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;