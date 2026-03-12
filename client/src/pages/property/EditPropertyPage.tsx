import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { PropertyType, ListingType } from "../../auth-types/property.types";
import { updateProperty } from "../../services/property.service";
import { useProperties } from "../../hooks/useProperties";
import { Tag, CreditCard } from "lucide-react";
import { MapPicker } from "../../components/property/mapPicker";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    location: "",
    available: true,
    propertyType: "APARTMENT" as PropertyType,
    listingType: "RENT" as ListingType,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 0,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const { properties } = useProperties();
  const property = useMemo(
    () => properties.find((p) => String(p.id) === String(id)),
    [properties, id]
  );

  useEffect(() => {
    if (!id) return;
    if (!property) {
      setLoading(false);
      setError("Could not find the property details.");
      return;
    }
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      available: property.available,
      propertyType: property.propertyType,
      listingType: property.listingType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaSqFt: property.areaSqFt,
      latitude: property.latitude ?? undefined,
      longitude: property.longitude ?? undefined,
    });
    setLoading(false);
    setError(null);
  }, [id, property]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);

    try {
      await updateProperty(Number(id), {
        ...formData,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
      });

      navigate("/landlord/properties");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Update failed");
      }
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return (
      <div className="pt-24 container-page">
        <div className="card p-10 text-center text-slate-500 font-medium">
          Loading property…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 container-page">
        <div className="card p-10 text-center">
          <p className="font-extrabold text-slate-900">Not found</p>
          <p className="text-slate-500 mt-1">{error}</p>
          <button
            onClick={() => navigate("/landlord/properties")}
            className="btn-accent mt-6"
          >
            Back to inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 container-page max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="card p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Edit listing</h1>
        <p className="text-slate-500 mt-1 text-sm">Update your property details.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Title
            </label>
            <input
              className="input mt-1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Listing Type */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Listing Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: "RENT" })}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${formData.listingType === "RENT"
                  ? "border-[#e51013] bg-red-50 text-[#e51013]"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
              >
                <Tag className="w-5 h-5" />
                <span className="font-bold text-sm">For Rent</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: "SALE" })}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${formData.listingType === "SALE"
                  ? "border-[#e51013] bg-red-50 text-[#e51013]"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-bold text-sm">For Sale</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {formData.listingType === "RENT" ? "Rent Price ($)" : "Sale Price ($)"}
              </label>
              <input
                className="input mt-1"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Type
              </label>
              <select
                className="select mt-1"
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    propertyType: e.target.value as PropertyType,
                  })
                }
              >
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Location
            </label>
            <input
              className="input mt-1"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bedrooms
              </label>
              <input
                className="input mt-1"
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bathrooms
              </label>
              <input
                className="input mt-1"
                type="number"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Area (sq ft)
              </label>
              <input
                className="input mt-1"
                type="number"
                value={formData.areaSqFt}
                onChange={(e) =>
                  setFormData({ ...formData, areaSqFt: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              className="input mt-1 min-h-[120px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* ── Map Picker ── */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Property Location on Map
            </label>
            <div className="mt-2">
              <MapPicker
                latitude={formData.latitude ?? undefined}
                longitude={formData.longitude ?? undefined}
                onChange={(lat, lng) =>
                  setFormData({ ...formData, latitude: lat ?? undefined, longitude: lng ?? undefined })
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-3 pt-2 select-none">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
            />
            <span className="text-sm font-bold text-slate-700">
              {formData.listingType === "RENT"
                ? "Available for rent"
                : "Available for sale"}
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={updating}
              className="btn-accent py-3 w-full sm:w-auto gap-2"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Update Property"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              className="btn-ghost py-3 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;
