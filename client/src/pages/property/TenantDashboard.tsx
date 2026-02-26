import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Heart,
  FileText,
  MessageSquare,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import type { Stats, Application, PropertyPreview } from "../../types";

const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendations, setRecommendations] = useState<PropertyPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, appsRes, recsRes] = await Promise.all([
          api.get<Stats>("/tenants/stats"),
          api.get<Application[]>("/tenants/applications"),
          api.get<PropertyPreview[]>("/tenants/recommendations?limit=6"),
        ]);

        setStats(statsRes.data);
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
        setRecommendations(Array.isArray(recsRes.data) ? recsRes.data : []);
      } catch (err: unknown) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getImgUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400&auto=format&fit=crop";
    if (imagePath.startsWith("http")) return imagePath;

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3005";
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

    if (cleanPath.startsWith("uploads/")) {
      return `${baseUrl}/${cleanPath}`;
    }

    return `${baseUrl}/uploads/${cleanPath}`;
  };

  const handleToggleSave = async (propertyId: number) => {
    try {
      const isCurrentlySaved = recommendations.find(p => p.id === propertyId)?.isSaved;
      if (isCurrentlySaved) {
        await api.delete(`/favorites/property/${propertyId}`);
      } else {
        await api.post(`/favorites`, { propertyId });
      }

      setRecommendations(prev =>
        prev.map(p => p.id === propertyId ? { ...p, isSaved: !p.isSaved } : p)
      );
    } catch (err: unknown) {
      console.error("Error toggling save:", err);
    }
  };

  const statConfig = [
    { label: "Applications Sent", key: "applicationsSent", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Saved Listings",    key: "savedListings",    icon: Heart,     color: "text-red-600",  bg: "bg-red-50" },
    { label: "Active Messages",   key: "activeMessages",   icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  if (error) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl inline-block border border-red-100">
          <p className="font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Find Your Next Home, {user?.name}
          </h1>
          <p className="text-slate-500 font-medium">Manage your applications and saved properties.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {loading
          ? [1, 2, 3].map((i) => (
            <div key={i} className="card p-6 h-24 animate-pulse bg-slate-100 border-none" />
          ))
          : statConfig.map((stat) => (
            <div
              key={stat.label}
              className="card p-6 flex items-start justify-between group hover:border-emerald-500/30 transition-all duration-300"
            >
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {stats ? stats[stat.key as keyof Stats] : 0}
                </h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Applications</h2>
            <Link to="/my-applications" className="text-sm font-bold text-emerald-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="card p-5 h-24 animate-pulse bg-slate-100 border-none" />
              ))
            ) : Array.isArray(applications) && applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={getImgUrl(app.property.images?.[0] || app.property.imageUrl)}
                        className="w-full h-full object-cover"
                        alt={app.property.title}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.property.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">By {app.property.landlord.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" /> {formatRelativeDate(app.createdAt)}
                        </span>
                        <span className="font-bold text-slate-700">${app.property.price.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      app.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                      app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => navigate(`/my-applications`)}
                      className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1"
                    >
                      Details <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-10 text-center border-dashed border-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No applications yet.</p>
                <Link
                  to="/properties"
                  className="text-emerald-600 text-sm font-bold hover:underline mt-2 inline-block"
                >
                  Browse properties
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Properties */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Top Picks for You</h2>
          <div className="space-y-4">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="card h-48 animate-pulse bg-slate-100 border-none" />
              ))
            ) : Array.isArray(recommendations) && recommendations.length > 0 ? (
              recommendations.map((property) => (
                <div
                  key={property.id}
                  className="card overflow-hidden group hover:border-emerald-500/30 transition-all"
                >
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    <img
                      src={getImgUrl(property.images?.[0] || property.imageUrl)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={property.title}
                    />
                    <button
                      onClick={() => handleToggleSave(property.id)}
                      className={`absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full transition-colors shadow-sm ${
                        property.isSaved ? "text-red-500" : "text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${property.isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{property.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Listed by {property.landlord.name}</p>
                    <p className="text-xs text-slate-500 mb-2">{property.location}</p>
                    <p className="text-emerald-600 font-bold text-sm">${property.price.toLocaleString()}/mo</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-6 text-center border-dashed border-2">
                <p className="text-slate-500 text-sm font-medium">No recommendations available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;