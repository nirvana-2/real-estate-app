import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import type { Role } from "../../auth-types/auth.types";
import { Mail, Lock, User, Briefcase, Home, CheckCircle2, ArrowRight } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT" as Role,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await register(formData);
      if (user.role === "LANDLORD") {
        navigate("/landlord/properties");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1470"
          alt="Luxury Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 hover:scale-100 transition-transform duration-10000 ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-2">
            <div className="bg-[#e51013] p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">RealEstate</span>
          </div>

          <div>
            <h2 className="text-5xl font-black leading-tight mb-8">
              Begin your <br />
              <span className="text-[#e51013]">property journey</span> <br />
              with us.
            </h2>
            <div className="space-y-6">
              {[
                "Access exclusive off-market listings",
                "Direct communication with top agents",
                "Powerful tools for buyers and sellers",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-100">
                  <div className="bg-[#e51013]/20 p-1.5 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-[#e51013]" />
                  </div>
                  <span className="font-medium text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <span>© 2026 RealEstate Inc.</span>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white py-12 scrollbar-hide overflow-y-auto">
        <div className="w-full max-sm mx-auto">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden mb-12">
            <div className="bg-[#e51013] p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">RealEstate</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3 text-center md:text-left">Create account</h1>
            <p className="text-slate-500 font-medium text-center md:text-left">Join thousands of happy homeowners.</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 text-[#e51013] border border-red-100 rounded-xl px-4 py-3.5 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e51013]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative group">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input pl-12"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-12"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#e51013] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "TENANT" })}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.role === "TENANT"
                      ? "border-[#e51013] bg-red-50/50"
                      : "border-slate-100 hover:border-slate-200"
                    }`}
                >
                  <User className={`w-5 h-5 mb-2 ${formData.role === "TENANT" ? "text-[#e51013]" : "text-slate-400"}`} />
                  <div className="font-bold text-slate-900 text-sm">Tenant</div>
                  <p className="text-[11px] text-slate-500 font-medium">Buying/Renting</p>
                  {formData.role === "TENANT" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e51013]" />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "LANDLORD" })}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.role === "LANDLORD"
                      ? "border-[#e51013] bg-red-50/50"
                      : "border-slate-100 hover:border-slate-200"
                    }`}
                >
                  <Briefcase className={`w-5 h-5 mb-2 ${formData.role === "LANDLORD" ? "text-[#e51013]" : "text-slate-400"}`} />
                  <div className="font-bold text-slate-900 text-sm">Landlord</div>
                  <p className="text-[11px] text-slate-500 font-medium">Selling/Listing</p>
                  {formData.role === "LANDLORD" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e51013]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-accent w-full py-4 group mt-2">
              <span className="flex items-center justify-center gap-2">
                {loading ? "Creating account..." : "Register"}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="pt-6 border-t border-slate-100 mt-8 text-center md:text-left">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link className="font-bold text-[#e51013] hover:underline px-1 py-0.5 rounded-md hover:bg-red-50 transition-colors" to="/login">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;