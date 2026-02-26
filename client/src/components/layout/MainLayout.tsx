import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  const { loading } = useAuth();

  // Logic: Wait for the AuthProvider to check the JWT token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
            <p className="font-bold text-slate-700">Verifying session…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navbar />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-white">
        <div className="container-page py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-slate-700">Hamro Real-State</span>
          <span>© {new Date().getFullYear()} Real Estate Management System</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;