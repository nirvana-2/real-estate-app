import React, { useState, useEffect } from "react";
import { BookingService } from "../../services/booking.service";
import { Calendar, MapPin, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const response = await BookingService.getTenantBookings();
                
                // FIX: Extract the array from the object { bookings: [...] }
                // This prevents the ".map is not a function" error
                const dataArray = response.bookings || response;
                setBookings(Array.isArray(dataArray) ? dataArray : []);
                
            } catch (err) {
                console.error("failed to fetch bookings", err);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <Calendar className="text-[#e51013]" />
                    My Tour Schedule
                </h1>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">You haven't requested any property tours yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow border border-slate-50">
                                <div className="flex gap-4">
                                    {/* Property Mini Image */}
                                    <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                                        <img
                                            // Ensure this points to the correct image field in your property object
                                            src={booking.property.images?.[0] || "https://via.placeholder.com/150"}
                                            alt="Property"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{booking.property.title}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {booking.property.location}
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-1 text-slate-700 font-medium text-sm">
                                                <Calendar className="w-4 h-4 text-[#e51013]" />
                                                {/* FIX: Changed from tourDate to date to match your controller */}
                                                {format(new Date(booking.date), "MMM dd, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-700 font-medium text-sm">
                                                <Clock className="w-4 h-4 text-[#e51013]" />
                                                {format(new Date(booking.date), "hh:mm b")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                    <button
                                        onClick={() => {/* Add cancel logic here later */ }}
                                        className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;