import React, { useEffect, useState } from "react";
import { getPropertyApplications, updateApplicationStatus } from "../../services/application.service";
import type { Application, ApplicationStatus } from "../../auth-types/application.types";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  MessageSquare,
  Building2,
  Filter,
} from "lucide-react";
import axios from "axios";

const ReviewApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getPropertyApplications();
      setApplications(data.applications);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: number, newStatus: ApplicationStatus) => {
    if (!window.confirm(`Are you sure you want to set this application to ${newStatus}?`)) return;

    try {
      setUpdatingId(id);
      await updateApplicationStatus(id, newStatus);
      
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Loading applications...</p>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rental Applications</h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage tenant requests for your properties.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            All Statuses
          </div>
        </div>
      </div>
      
      {applications.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
          <p className="text-slate-500">New tenant requests will appear here once they apply.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="card overflow-hidden hover:border-slate-300 transition-all duration-300 group">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-900">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{app.property?.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                  app.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : 
                  app.status === "REJECTED" ? "bg-red-100 text-red-700" : 
                  "bg-amber-100 text-amber-700"
                }`}>
                  {app.status}
                </span>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium"><span className="text-slate-400 mr-2 font-normal">Applicant:</span>{app.tenant?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium"><span className="text-slate-400 mr-2 font-normal">Contact:</span>{app.tenant?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium"><span className="text-slate-400 mr-2 font-normal">Applied:</span>2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" />
                      Tenant Message
                    </div>
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                      "{app.message || "No message provided."}"
                    </p>
                  </div>
                </div>

                {app.status === "PENDING" && (
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => handleStatusChange(app.id, "APPROVED" as ApplicationStatus)}
                      disabled={updatingId === app.id}
                      className="btn-accent py-2 px-6 text-sm flex items-center gap-2 group disabled:opacity-50"
                    >
                      {updatingId === app.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Approve Tenant
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, "REJECTED" as ApplicationStatus)}
                      disabled={updatingId === app.id}
                      className="px-6 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewApplicationsPage;