import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, MapPin, DollarSign, Eye } from "lucide-react";
import { useProperties } from "../../hooks/useProperties";
import { deleteProperty } from "../../services/property.service";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const ManagePropertiesPage = () => {
  const [page, setPage] = useState(1);
  const { properties, loading, error, refresh, pagination } = useProperties({
    scope: 'my',
    page,
    limit: 6
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);

  // Logic: Handle Deletion
  const handleDelete = async (id: number) => {
    // Logic: Quick check to ensure only the owner/admin can trigger delete
    if (!window.confirm("Are you sure you want to delete this property from the inventory?")) return;

    try {
      await deleteProperty(id);
      refresh(); // Logic: Sync UI with backend (Prisma/DB)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setActionError(err.response?.data?.message || "Delete failed");
      }
    }
  };

  if (loading) return (
    <div className="pt-24 container-page">
      <div className="card p-10 text-center text-slate-500 font-medium">Loading your inventory…</div>
    </div>
  );

  // Logic: Security check for Landlord/Admin access
  if (user?.role === "TENANT") {
    return (
      <div className="pt-24 container-page">
        <div className="card p-10 text-center">
          <p className="font-extrabold text-slate-900">Access denied</p>
          <p className="text-slate-500 mt-1">Tenants cannot manage inventory.</p>
          <Link to="/" className="btn-accent mt-6">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 container-page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Property Inventory</h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage your listings.</p>
        </div>
        <button onClick={() => navigate("/property/create")} className="btn-accent gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {actionError && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium">
          {actionError}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-extrabold text-slate-900">No listings yet</p>
          <p className="text-slate-500 mt-1">Create your first property to start receiving applications.</p>
          <button onClick={() => navigate("/property/create")} className="btn-accent mt-6 gap-2">
            <Plus className="w-4 h-4" />
            Create Listing
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="card p-6 hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/property/${p.id}`} className="text-lg font-extrabold text-slate-900 hover:text-[#e51013] transition-colors line-clamp-1">
                      {p.title}
                    </Link>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> {p.location}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-3 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-slate-400" /> {p.price.toLocaleString()}
                      <span className="text-slate-400 font-bold">/mo</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${p.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                    {p.available ? "AVAILABLE" : "OFF MARKET"}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate(`/property/${p.id}`)} className="btn-ghost gap-2 ring-1 ring-slate-200">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button onClick={() => navigate(`/property/edit/${p.id}`)} className="btn-primary gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
        </>
      )}
    </div>
  );
};

export default ManagePropertiesPage;