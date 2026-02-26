import { useEffect, useState } from "react";
import { getPropertyApplications } from "../../services/application.service";
import type { Application } from "../../auth-types/application.types";
import { FileText, Clock, Building2, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getPropertyApplications(page, 10);
                setApplications(data.applications);
                if (data.page !== undefined) {
                    setPagination({
                        total: data.total || 0,
                        page: data.page,
                        totalPages: data.totalPages || 1
                    });
                }
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [page]);

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#e51013] animate-spin" />
        </div>
    );

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-white">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5">
                    <FileText className="w-6 h-6 text-[#e51013]" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Applications</h1>
                    <p className="text-slate-500 font-medium">Track your rental requests and their status.</p>
                </div>
            </div>

            <div className="space-y-4">
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Building2 className="w-10 h-10 text-slate-200" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h2>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Find your ideal home and submit an application to start your journey.</p>
                        <Link to="/" className="btn-accent px-8 py-3.5">
                            Explore Properties
                        </Link>
                    </div>
                ) : (
                    applications.map(app => (
                        <div key={app.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{app.property?.title}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-sm font-bold text-[#e51013]">${app.property?.price.toLocaleString()}/mo</p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" />
                                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-red-100 text-[#e51013]'
                                        }`}>
                                        {app.status}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Current Status</p>
                                </div>
                                <Link to={`/property/${app.property?.id}`} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-8 h-8 rounded-xl font-bold transition-all text-xs ${page === i + 1
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
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all font-bold text-xs"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
