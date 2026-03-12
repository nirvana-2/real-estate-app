import React, { useEffect, useState } from "react";
import { useProperties } from "../../hooks/useProperties";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Users,
  PlusCircle,
  Home,
  FileText,
  DollarSign,
  Check,
  X,
  Edit,
  Trash2,
  Clock,
  MessageSquare,
  Eye
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";
import { getPropertyApplications, updateApplicationStatus } from "../../services/application.service";
import type { Application } from "../../auth-types/application.types";
import { deleteProperty } from "../../services/property.service";
import { getImageUrl } from "../../utils/url.utils";
import { AgentProfileSettings } from "./AgentProfileSettings";

export const LandlordDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const { properties, loading: propertiesLoading, refresh: refreshProperties, pagination } = useProperties({
    page,
    limit: 5
  });
  useAuth();
  const { unreadCount } = useUnreadMessages();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getPropertyApplications();
        setApplications(data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setAppsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleDeleteProperty = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        refreshProperties();
      } catch (error) {
        alert("Failed to delete property");
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: "APPROVED" | "REJECTED") => {
    try {
      await updateApplicationStatus(id, status);
      // Update local state
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const stats = [
    {
      label: "Total Listings",
      value: properties.length,
      icon: Building2,
      color: "text-[#e51013]",
      bg: "bg-red-50"
    },
    {
      label: "Active Rentals",
      value: properties.filter(p => p.listingType === "RENT" && p.available).length,
      icon: Home,
      color: "text-[#e51013]",
      bg: "bg-red-50"
    },
    {
      label: "Total Inquiries",
      value: applications.length,
      icon: Users,
      color: "text-[#e51013]",
      bg: "bg-red-50"
    },
    {
      label: "Monthly Revenue",
      value: `$${properties.filter(p => p.listingType === "RENT" && !p.available).reduce((sum, p) => sum + p.price, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-[#e51013]",
      bg: "bg-red-50"
    },
  ];

  if (propertiesLoading || appsLoading) return (
    <div className="pt-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e51013]"></div>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Landlord Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your properties and review tenant applications.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/property/create" className="bg-[#e51013] text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-bold hover:bg-[#c40e10] transition-colors shadow-lg shadow-red-500/20">
            <PlusCircle className="w-5 h-5" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6 flex items-start justify-between bg-white border border-slate-100 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
        <Link
          to="/messages"
          className="card p-6 flex items-start justify-between bg-white border border-slate-100 shadow-sm hover:border-[#e51013]/30 hover:shadow-md transition-all"
        >
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Messages</p>
            <h3 className="text-2xl font-black text-slate-900">
              {unreadCount > 0 ? (
                <span className="text-[#e51013]">{unreadCount} unread</span>
              ) : (
                "Inbox"
              )}
            </h3>
          </div>
          <div className="relative">
            <div className="bg-red-50 text-[#e51013] p-3 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e51013] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* My Properties Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#e51013]" />
              My Properties
            </h2>
          </div>
          <div className="card overflow-hidden border-slate-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Home className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link to={`/property/${p.id}`} className="text-sm font-bold text-slate-900 hover:text-[#e51013] transition-colors line-clamp-1">
                              {p.title}
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-1">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-600">{p.listingType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-900">${p.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${p.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-[#e51013]"
                          }`}>
                          {p.available ? "Available" : "Rented"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/property/${p.id}`}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="View Property"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => navigate(`/property/edit/${p.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-2 text-slate-400 hover:text-[#e51013] transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-xl font-bold transition-all text-xs cursor-pointer ${page === i + 1
                        ? "bg-[#e51013] text-white shadow-lg shadow-red-500/20"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e51013]" />
            Recent Applications
          </h2>
          <div className="card border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {applications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500 font-medium">No applications found.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-[#e51013] flex items-center justify-center font-bold">
                          {app.tenant?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{app.tenant?.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${app.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        app.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                          "bg-red-100 text-[#e51013]"
                        }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-1 italic">
                      "Interested in {app.property?.title}"
                    </p>
                    {app.status === "PENDING" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, "APPROVED")}
                          className="flex items-center justify-center gap-1 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                          className="flex items-center justify-center gap-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="bg-slate-50 p-4 text-center">
              <button
                onClick={() => navigate("/landlord/applications")}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                View All Applications
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <AgentProfileSettings />
        </div>
      </div>
    </div>
  );
};
