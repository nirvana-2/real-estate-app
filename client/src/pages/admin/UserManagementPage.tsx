import { useEffect, useState } from "react";
import { getAllUsersAdmin, updateUserAdmin, deleteUserAdmin } from "../../services/user.service";
import type { currentUser, Role } from "../../auth-types/auth.types";
import {
  Users,
  Search,
  UserPlus,
  UserX,
  Filter,
  Shield,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const PAGE_SIZE = 10;

const RoleBadge = ({ role }: { role: Role }) => {
  const styles: Record<Role, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    LANDLORD: "bg-emerald-100 text-emerald-700 border-emerald-200",
    TENANT: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${styles[role]}`}>
      <Shield className="w-3 h-3 mr-1" />
      {role}
    </span>
  );
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<currentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersAdmin();
      setUsers(data.user);
    } catch (err) {
      setError("Failed to load user list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: Role) => {
    try {
      setUpdatingUserId(userId);
      await updateUserAdmin(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      await deleteUserAdmin(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQuery, roleFilter]);

  // Stats calculation
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMIN").length,
    landlords: users.filter(u => u.role === "LANDLORD").length,
    tenants: users.filter(u => u.role === "TENANT").length,
  };

  if (loading && users.length === 0) {
    return (
      <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#e51013] animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Accessing system directories...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Oversight</h1>
          <p className="text-slate-500 font-bold mt-1 tracking-tight">Manage user identities and platform permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">
            {filteredUsers.length} Results
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-slate-900", bg: "bg-slate-50" },
          { label: "Administrators", value: stats.admins, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Landlords", value: stats.landlords, icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Tenants", value: stats.tenants, icon: UserX, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 border border-white/50 shadow-sm transition-transform hover:scale-[1.02] cursor-default`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className={stat.color} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
            </div>
            <p className={`text-4xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Error UI */}
      {error && (
        <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-bold border border-red-100 mb-8 flex items-center gap-4 shadow-sm animate-in zoom-in">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto underline hover:text-red-800">Retry Fetch</button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl shadow-slate-200/50">
        {/* Search Engine */}
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Scan for name or email identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Role Filter Console */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 px-3">
            <Filter size={16} className="text-slate-400" />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
            {["ALL", "ADMIN", "LANDLORD", "TENANT"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r as Role | "ALL")}
                className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${roleFilter === r
                  ? "bg-white text-slate-900 shadow-lg shadow-slate-200 ring-1 ring-slate-100"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main User Inventory Table */}
      {pagedUsers.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-100 py-32 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Zero matches in database</h3>
          <p className="text-slate-500 mt-2 font-bold max-w-sm mx-auto">No users found matching current scan parameters. Try broadening your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registration Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Level</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pagedUsers.map((user) => (
                  <tr key={user.id} className={`group transition-all hover:bg-slate-50/70 border-l-4 ${updatingUserId === user.id ? "opacity-50 border-[#e51013]" : "border-transparent hover:border-slate-300"}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 font-bold mt-0.5 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <RoleBadge role={user.role} />
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer hover:bg-white transition-colors"
                          disabled={updatingUserId === user.id}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="LANDLORD">LANDLORD</option>
                          <option value="TENANT">TENANT</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                        disabled={updatingUserId === user.id}
                        title="Revoke Identity"
                      >
                        {updatingUserId === user.id ? (
                          <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Engine */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-black tracking-widest uppercase">
                Page <span className="text-slate-900">{page}</span> of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:shadow-xl hover:shadow-slate-200/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="hidden sm:flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === p
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-300"
                        : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:shadow-xl hover:shadow-slate-200/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;