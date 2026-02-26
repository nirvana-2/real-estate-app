import { api } from "../api/axios";

export const BookingService={
    //tenant uses this to match router post("/")
    createBooking:async(bookingData:{propertyId:number; date:string; message:string})=>{
        const response=await api.post("bookings",bookingData);
        return response.data;
    },
    //tenant uses this to match router.get("/my")
    getTenantBookings:async()=>{
        const response=await api.get("/bookings/my");
        return response.data;
    },
    //landlord usees this -matches router.get("/property")
    getLandlordPropertiesBookings:async()=>{
        const response=await api.get("/bookings/property");
        return response.data
    },
    updateBookingStatus: async (id: number, status?: "CONFIRMED" | "CANCELLED", date?: string) => {
        const response = await api.patch(`/bookings/${id}/status`, { status, date });
        return response.data;
      },
}