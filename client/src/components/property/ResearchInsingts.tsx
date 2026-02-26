import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Loader2, MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet Icon Fixes ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const propertyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- Constants & Types ---
const KATHMANDU_LAT = 27.7172;
const KATHMANDU_LNG = 85.3240;

interface ResearchInsightsProps {
  latitude?: number;
  longitude?: number;
  propertyName?: string;
}

const CATEGORIES = [
  { label: "🏫 Schools",      type: "school" },
  { label: "🏥 Hospitals",    type: "hospital" },
  { label: "🍽️ Restaurants", type: "restaurant" },
  { label: "🏦 Banks",        type: "bank" },
  { label: "🛒 Supermarkets", type: "supermarket" },
];

const amenityCache: Record<string, any[]> = {};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function ResearchInsights({ 
  latitude = KATHMANDU_LAT, 
  longitude = KATHMANDU_LNG, 
  propertyName = "Kathmandu" 
}: ResearchInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Distance Calculation Logic ---
  const getDistance = (lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - latitude) * Math.PI) / 180;
    const dLon = ((lon2 - longitude) * Math.PI) / 180;
    const a: number =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1000);
  };

  const handleCategoryClick = async (type: string) => {
    if (loading) return;

    const cacheKey = `${type}-${latitude}-${longitude}`;
    if (amenityCache[cacheKey]) {
      setPlaces(amenityCache[cacheKey]);
      setSelectedCategory(type);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedCategory(type);

    const query = `[out:json][timeout:15];node["amenity"="${type}"](around:800,${latitude},${longitude});out 15;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error("Server busy. Please try again.");
      }

      const data = await response.json();
      if (data.elements) {
        const formatted = data.elements.map((item: any) => ({
          name: item.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          lat: item.lat,
          lon: item.lon,
          address: item.tags?.["addr:street"] || "Nearby Area",
          distance: getDistance(item.lat, item.lon)
        })).sort((a: any, b: any) => a.distance - b.distance);

        amenityCache[cacheKey] = formatted;
        setPlaces(formatted);
      }
    } catch (err) {
      setError("Service busy. Please try another category.");
    } finally {
      setLoading(false);
    }
  };

  // --- AUTO-FETCH ON MOUNT ---
  useEffect(() => {
    // Automatically load "Schools" when the dashboard opens
    handleCategoryClick("school");
  }, [latitude, longitude]); // Re-scans if the user searches a new location like "Boudha"

  return (
    <div className="bg-white rounded-2xl">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-[#e51013] rounded-xl w-9 h-9 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Nearby Amenities</h2>
        </div>
        <p className="text-sm text-slate-500 ml-12">
          Exploring around <span className="text-[#e51013] font-semibold">{propertyName}</span>
        </p>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              onClick={() => handleCategoryClick(cat.type)}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                selectedCategory === cat.type
                  ? "bg-[#e51013] text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* MAP COMPONENT */}
        <div className="h-[350px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
          <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={[latitude, longitude]} icon={propertyIcon}>
              <Popup><b>{propertyName}</b></Popup>
            </Marker>

            {places.map((place, idx) => (
              <Marker key={idx} position={[place.lat, place.lon]}>
                <Popup>
                    <div className="text-xs">
                        <p className="font-bold">{place.name}</p>
                        <p>{place.distance}m away</p>
                    </div>
                </Popup>
              </Marker>
            ))}

            <RecenterMap lat={latitude} lng={longitude} />
          </MapContainer>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#e51013]" />
            <p className="text-xs text-slate-400">Scanning Kathmandu...</p>
          </div>
        )}

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{error}</div>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {places.map((place, idx) => (
              <div key={idx} className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-white hover:border-red-100 transition-colors">
                 <div className="flex-1 min-w-0 pr-2">
                   <h3 className="font-bold text-slate-900 text-sm truncate">{place.name}</h3>
                   <p className="text-[10px] text-slate-400 truncate">{place.address}</p>
                 </div>
                 <div className="text-[#e51013] font-bold text-[10px] bg-red-50 px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                   <Navigation className="w-3 h-3" />
                   {place.distance}m
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}