import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutGrid,
  LogOut,
  Shield,
  User,
  Heart,
  MessageSquare,
  Calendar,
  ChevronDown,
  Settings,
  ClipboardList,
  PlusCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm font-bold transition-colors ${isActive ? "text-[#e51013]" : "text-slate-600 hover:text-slate-900"}`
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
            <Building2 className="w-5 h-5" />
          </span>
          <span className="hidden sm:inline text-lg tracking-tight">Hamro Real-State</span>
        </Link>

        {/* Main Navigation - Decluttered */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          {user?.role !== "LANDLORD" && <NavItem to="/buy">Buy</NavItem>}
          <NavItem to="/rent">Rent</NavItem>
          <NavItem to="/new-homes">New homes</NavItem>
          <NavItem to="/find-agents">Find agents</NavItem>
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              to="/messages"
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 shadow-sm"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#e51013] text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1 border-2 border-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Trigger */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm overflow-hidden">
                  {user.role === "ADMIN" ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight mr-1">
                  <p className="text-xs font-extrabold text-slate-900 truncate max-w-[100px]">{user.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Premium Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute -right-10 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  {/* Dropdown Header */}
                  <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email || (user.role.toLowerCase() + "@realestate.com")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div className="p-2">
                    {/* TENANT ITEMS */}
                    {user.role === "TENANT" && (
                      <>
                        <DropdownItem to="/tenant/dashboard" icon={<LayoutGrid size={18} />} label="Tenant Portal" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem to="/my-applications" icon={<ClipboardList size={18} />} label="My Applications" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem to="/my-bookings" icon={<Calendar size={18} />} label="My Bookings" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem
                          to="/favorites"
                          icon={<Heart size={18} className={favorites.length > 0 ? "fill-[#e51013] text-[#e51013]" : ""} />}
                          label="Saved Properties"
                          badge={favorites.length > 0 ? favorites.length : undefined}
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </>
                    )}

                    {/* LANDLORD ITEMS */}
                    {user.role === "LANDLORD" && (
                      <>
                        <DropdownItem
                          to="/landlord/dashboard"
                          icon={<LayoutGrid size={18} />}
                          label="Landlord Portal"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          to="/landlord/properties"
                          icon={<Building2 size={18} />}
                          label="My Listings"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          to="/landlord/applications"
                          icon={<ClipboardList size={18} />}
                          label="Applications"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          to="/landlord/tours"
                          icon={<Calendar size={18} />}
                          label="Tour Requests"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          to="/property/create"
                          icon={<PlusCircle size={18} />}
                          label="Add Property"
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </>
                    )}
                    {/* ADMIN ITEMS */}
                    {user.role === "ADMIN" && (
                      <>
                        <DropdownItem to="/admin/applications" icon={<ClipboardList size={18} />} label="All Applications" onClick={() => setIsProfileOpen(false)} />
                        <DropdownItem to="/admin/users" icon={<User size={18} />} label="User Management" onClick={() => setIsProfileOpen(false)} />
                      </>
                    )}

                    <DropdownItem to="/profile-settings" icon={<Settings size={18} />} label="Settings" onClick={() => setIsProfileOpen(false)} />
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary px-6 py-2 rounded-xl text-sm font-extrabold shadow-lg shadow-[#e51013]/20">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({
  to,
  icon,
  label,
  badge,
  onClick
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-slate-400 group-hover:text-slate-900 transition-colors">
          {icon}
        </span>
        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      </div>
      {badge !== undefined && (
        <span className="min-w-[18px] h-4.5 bg-[#e51013] text-white text-[10px] flex items-center justify-center rounded-full font-bold px-1.5 shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );
}