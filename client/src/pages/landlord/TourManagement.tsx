import React, { useEffect, useState } from "react";
import { BookingService } from "../../services/booking.service";
import {
  Calendar,
  Clock,
  User,
  Home,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  Search,
  Mail,
} from "lucide-react";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../../utils/url.utils";

const TourManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");

  const fetchBookings = async () => {
    try {
      const data = await BookingService.getLandlordPropertiesBookings();
      // Ensure we access the array correctly based on your controller response
      setBookings(data.bookings || data);
    } catch (err) {
      console.log(err)
      toast.error("Failed to load tour requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: number, status?: "CONFIRMED" | "CANCELLED", date?: string) => {
    try {
      await BookingService.updateBookingStatus(id, status, date);
      toast.success(date ? "Tour rescheduled" : `Request ${status?.toLowerCase()}ed`);
      setReschedulingId(null);
      setNewDate("");
      fetchBookings();
    } catch (err) {
      console.log(err)
      toast.error("Update failed");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tenant?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "All") return true;

    const tourDate = new Date(booking.date);
    const today = startOfDay(new Date());

    if (activeTab === "Pending") return booking.status === "PENDING";
    if (activeTab === "Upcoming") return booking.status === "CONFIRMED" && isAfter(tourDate, today);
    if (activeTab === "Past") return booking.status === "CANCELLED" || (booking.status === "CONFIRMED" && isBefore(tourDate, today));

    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Viewing Requests</h1>
          <p className="text-slate-500">Manage tour schedules for your property listings.</p>
        </div>
        <div className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          {filteredBookings.length} Requests Found
        </div>
      </div>

      {/* Filtering and Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
          {["All", "Pending", "Upcoming", "Past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by property or tenant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-slate-300 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No requests yet</h3>
          <p className="text-slate-500">When tenants book a tour, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-start gap-5 w-full">
                {/* Property Thumbnail */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                  {booking.property?.images?.[0] ? (
                    <img
                      src={getImageUrl(booking.property.images[0])}
                      alt={booking.property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Home className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-lg truncate">
                      {booking.property?.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          'bg-red-50 text-red-600 border-red-200'
                      }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{booking.tenant?.name}</span>
                        <a
                          href={`mailto:${booking.tenant?.email}`}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Send Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Send Message"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-rose-500" />
                      </div>
                      <span className="font-medium text-slate-600">
                        {format(new Date(booking.date), "EEE, MMM do")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">
                        <Clock className="w-4 h-4 text-rose-500" />
                      </div>
                      <span className="font-medium text-slate-600">
                        {format(new Date(booking.date), "hh:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                {reschedulingId === booking.id ? (
                  <div className="flex flex-col gap-2 w-full sm:w-64">
                    <input
                      type="datetime-local"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, undefined, newDate)}
                        disabled={!newDate}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setReschedulingId(null)}
                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : booking.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                      className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </>
                ) : booking.status === "CONFIRMED" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setReschedulingId(booking.id);
                        setNewDate(new Date(booking.date).toISOString().slice(0, 16));
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Reschedule
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <div className="ml-2 flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Scheduled
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <XCircle className="w-4 h-4" /> Cancelled
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

export default TourManagement;

