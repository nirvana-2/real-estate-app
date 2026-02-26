import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutGrid,
  LogOut,
  Shield,
  User,
  Heart,
  MessageSquare,
  Calendar // Added Calendar icon
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm font-bold transition-colors  ${isActive ? "text-blue-500" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { unreadCount } = useUnreadMessages();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-white/60">
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </span>
          <span className="hidden sm:inline">Hamro Real-State</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          {!user && (
            <>
              <NavItem to="/buy">Buy</NavItem>
              <NavItem to="/rent">Rent</NavItem>
              <NavItem to="/new-homes">New homes</NavItem>
              <NavItem to="/find-agents">Find agents</NavItem>
            </>
          )}

          {/* TENANT NAVIGATION */}
          {user?.role === "TENANT" && (
            <>
              <div className="relative">
                <NavItem to="/tenant/dashboard">Dashboard</NavItem>
              </div>
              <NavItem to="/my-applications">My Applications</NavItem>

              {/* NEW: My Bookings for Tenant */}
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                My Bookings
              </NavLink>

              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <MessageSquare className="w-5 h-5" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#e51013] text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
              <Link to="/favorites" className="relative p-2 text-slate-400 hover:text-[#e51013] transition-colors">
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-[#e51013] text-[#e51013]" : ""}`} />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#e51013] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* LANDLORD NAVIGATION */}
          {user?.role === "LANDLORD" && (
            <>
              <NavItem to="/landlord/dashboard">Dashboard</NavItem>
              <NavItem to="/landlord/properties">Properties</NavItem>
              <NavItem to="/landlord/applications">Applications</NavItem>

              {/* NEW: Tour Management for Landlord */}
              <NavLink
                to="/landlord/tours"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                Tour Requests
              </NavLink>

              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <MessageSquare className="w-5 h-5" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#e51013] text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NavItem to="/admin/applications">Applications</NavItem>
              <NavItem to="/admin/users">Users</NavItem>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                  {user?.role === "ADMIN" ? (
                    <Shield className="w-4 h-4" />
                  ) : user?.role === "LANDLORD" ? (
                    <LayoutGrid className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-extrabold text-slate-900 truncate max-w-[140px]">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="btn-ghost gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}