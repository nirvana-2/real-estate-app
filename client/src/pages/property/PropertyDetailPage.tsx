import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Property } from "../../auth-types/property.types";
import { getPropertyDetail, getPublicPropertyDetail } from "../../services/property.service";
import axios from "axios";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Heart,
  Navigation,
  Eye,
  ArrowLeft,
  Clock, // Added for the time picker icon
} from "lucide-react";
import { api } from "../../api/axios";
import { useFavorites } from "../../hooks/useFavorites";
import { getImageUrl } from "../../utils/url.utils";
import { ChatWindow } from "../../components/chat/ChatWindow";
import ResearchInsights from "../../components/property/ResearchInsingts";
import { MapViewer } from "../../components/property/mapViewer";

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const active = isFavorite(Number(id));

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // State for the date selected by the tenant
  const [tourDate, setTourDate] = useState("");

  // Initial state set to null so no map is shown on page load
  const [activeMapTab, setActiveMapTab] = useState<'location' | 'amenities' | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const data = user
          ? await getPropertyDetail(Number(id))
          : await getPublicPropertyDetail(Number(id));
        setProperty(data.property);
      } catch (err) {
        console.error("Error fetching property", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please login to apply");

    // Ensure a tour date is picked before allowing submission
    if (!tourDate) return alert("Please select a preferred viewing date.");

    setSubmitting(true);
    try {
      // Use the new atomic endpoint for both Application and Booking
      await api.post(`/properties/${id}/apply-and-book`, {
        message: message,
        tourDate: tourDate
      });

      alert("Application and Tour Request sent successfully!");
      setMessage("");
      setTourDate("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Already applied or error occurred");
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900" />
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Property not found</h2>
          <p className="text-slate-500 mt-2">
            The listing you're looking for might have been removed.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => {
            if (user?.role === 'LANDLORD') {
              navigate('/landlord/dashboard');
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {user?.role === 'LANDLORD' ? 'Back to Dashboard' : 'Back to Results'}
        </button>

        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <img
            src={getImageUrl(property.images?.[0])}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {user?.role === "TENANT" && (
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`p-2.5 rounded-full shadow-lg border border-white/20 backdrop-blur-md transition-all ${active
                    ? "bg-[#e51013] text-white"
                    : "bg-white/90 text-slate-400 hover:text-[#e51013]"
                  }`}
              >
                <Heart className={`w-5 h-5 ${active ? "fill-current" : ""}`} />
              </button>
            )}
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
              <span className="text-sm font-bold text-[#e51013]">
                {property.listingType === "RENT" ? "FOR RENT" : "FOR SALE"}
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
              <span className={`text-sm font-semibold ${property.available ? "text-emerald-600" : "text-amber-600"}`}>
                {property.available ? "● Available Now" : "● Off Market"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title & Price */}
            <div className="card p-8">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-slate-500 gap-1.5 text-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#e51013]">
                    ${property.price.toLocaleString()}
                  </span>
                  {property.listingType === "RENT" && (
                    <span className="text-slate-500 font-medium text-lg ml-1">/mo</span>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-100 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-900">
                    <Bed className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900">{property.bedrooms}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Beds</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-900">
                    <Bath className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900">{property.bathrooms}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Baths</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-900">
                    <Square className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900">{property.areaSqFt}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Sq Ft</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">About this home</h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Type: {property.propertyType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Pet Friendly: Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Parking: Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Lease Term: 12 Months</span>
                </div>
              </div>
            </div>

            {/* Map Explorer Section */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
                <button
                  onClick={() => setActiveMapTab('location')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${activeMapTab === 'location'
                      ? "bg-white text-[#e51013] shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-white/50"
                    }`}
                >
                  <MapPin className="w-4 h-4" />
                  Explore in Map
                </button>
                <button
                  onClick={() => setActiveMapTab('amenities')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${activeMapTab === 'amenities'
                      ? "bg-[#e51013] text-white shadow-lg"
                      : "text-slate-500 hover:bg-white/50"
                    }`}
                >
                  <Navigation className="w-4 h-4" />
                  Nearby Amenities
                </button>
              </div>

              <div className="p-8">
                {activeMapTab === null ? (
                  <div className="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="p-4 bg-white rounded-full w-fit mx-auto shadow-sm mb-4">
                      <Eye className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Explore Location Insights</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                      Click the buttons above to view the property location or explore nearby amenities.
                    </p>
                  </div>
                ) : property.latitude && property.longitude ? (
                  activeMapTab === 'location' ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-[#e51013]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Property Location</h3>
                      </div>
                      <MapViewer
                        latitude={property.latitude}
                        longitude={property.longitude}
                        propertyName={property.title}
                      />
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500">
                      <ResearchInsights
                        latitude={property.latitude}
                        longitude={property.longitude}
                        propertyName={property.title}
                      />
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700">Location Data Unavailable</h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {user?.role === "TENANT" ? (
                <div className="card p-6 shadow-2xl border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Book a Tour</h3>
                  </div>
                  <form onSubmit={handleApply} className="space-y-4">
                    {/* --- NEW TOUR DATE INPUT FIELD --- */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Preferred Viewing Date
                      </label>
                      <input
                        type="datetime-local"
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] outline-none transition-all bg-slate-50 font-medium"
                        required
                      />
                    </div>
                    {/* --- END NEW INPUT --- */}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Message to Landlord
                      </label>
                      <textarea
                        placeholder="Introduce yourself or ask a question..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none bg-slate-50"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !property.available}
                      className="btn-accent w-full py-3.5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed bg-[#e51013] hover:bg-red-700 text-white rounded-xl font-bold"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : property.available ? (
                        <>
                          Request Viewing & Apply
                          <Calendar className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      ) : (
                        "Property Unavailable"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatOpen(true)}
                      className="w-full py-3 flex items-center justify-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors border border-slate-200 rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Landlord
                    </button>
                  </form>
                </div>
              ) : user ? (
                <div className="card p-6 bg-slate-50 border-dashed border-2 border-slate-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-700 mb-1">Restricted Action</h4>
                      <p className="text-sm text-slate-500">
                        As a {user.role.toLowerCase()}, you can't book tours or apply.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Interested?</h4>
                  <p className="text-sm text-slate-600 mb-6">Sign in as a tenant to book a tour.</p>
                  <button onClick={() => (window.location.href = "/login")} className="btn-primary w-full py-3">
                    Sign In
                  </button>
                </div>
              )}

              {/* Landlord Card */}
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {property.landlord?.name?.[0] || "L"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{property.landlord?.name || "Host"}</h4>
                  <p className="text-xs text-slate-500">Member since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chatOpen && property && (
        <ChatWindow
          propertyId={property.id}
          landlordId={property.landlordId}
          propertyTitle={property.title}
          landlordName={property.landlord?.name}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;