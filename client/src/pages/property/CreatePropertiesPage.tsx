import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty, uploadPropertyImages } from "../../services/property.service";
import type { PropertyType, ListingType } from "../../auth-types/property.types";
import axios from "axios";
import {
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  PlusCircle,
  ArrowLeft,
  Loader2,
  ImagePlus,
  X,
  CreditCard,
  Tag
} from "lucide-react";
import { MapPicker } from "../../components/property/mapPicker";
interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  available: boolean;
  images: string[];
  latitude?: number;
  longitude?: number;
}

const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    location: "",
    price: 0,
    propertyType: "APARTMENT" as PropertyType,
    listingType: "RENT" as ListingType,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 0,
    available: true,
    images: [],
    latitude: undefined,
    longitude: undefined,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]!);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedImageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach((file) => {
          uploadFormData.append("images", file);
        });
        const uploadRes = await uploadPropertyImages(uploadFormData);
        uploadedImageUrls = uploadRes.urls;
      }

      await createProperty({
        ...formData,
        images: uploadedImageUrls,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
      });

      navigate("/landlord/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create property");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900">List a New Property</h1>
        <p className="text-slate-500 font-medium">
          Fill in the details to create your premium listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-1">Property Images</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#e51013] hover:bg-red-50/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#e51013] group-hover:bg-[#e51013]/5 transition-all">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Click to upload images</p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  PNG, JPG or WebP (Max 5MB each)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group"
                  >
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listing Type */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-1">Listing Type</label>
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

          <div className="grid grid-cols-1 gap-6">

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Property Title</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  name="title"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                  placeholder="e.g. Modern Penthouse with City View"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  name="location"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                  placeholder="City, Address"
                />
              </div>
            </div>

            {/* Price & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  {formData.listingType === "RENT" ? "Monthly Rent ($)" : "Sale Price ($)"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input
                    name="price"
                    type="number"
                    required
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
            </div>

            {/* Bedrooms / Bathrooms / Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Bedrooms</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                    <Bed className="w-5 h-5" />
                  </div>
                  <input
                    name="bedrooms"
                    type="number"
                    required
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Bathrooms</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                    <Bath className="w-5 h-5" />
                  </div>
                  <input
                    name="bathrooms"
                    type="number"
                    required
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Area (Sq Ft)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#e51013] transition-colors">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <input
                    name="areaSqFt"
                    type="number"
                    required
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
              <textarea
                name="description"
                required
                rows={5}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#e51013]/10 focus:border-[#e51013] focus:bg-white transition-all outline-none sm:text-sm placeholder:text-slate-300"
                placeholder="Describe the property features, amenities, and neighborhood..."
              />
            </div>

            {/* ── Map Picker ── */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Pin Property Location on Map
              </label>
              <MapPicker
                latitude={formData.latitude ?? undefined}
                longitude={formData.longitude ?? undefined}
                onChange={(lat, lng) =>
                  setFormData((prev) => ({ ...prev, latitude: lat ?? undefined, longitude: lng ?? undefined }))
                }
              />
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-accent py-4 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-[#e51013]/20 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Listing Property...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Create Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePropertyPage;