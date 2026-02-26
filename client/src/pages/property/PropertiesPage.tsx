import { useState } from "react";
import { MapPin } from "lucide-react";
import ResearchInsights from "../../components/property/ResearchInsingts";
import type { mapTypes } from "../../types";

export default function PropertiesPage() {
 
  // const [latitude, setLatitude] = useState<number | null>(27.7103);
  // const [longitude, setLongitude] = useState<number | null>(85.3240);
  // console.log(latitude,longitude)
  const [mapData,setMapData]=useState<mapTypes>({
    latitude:27.7172,
    longitude: 85.3240,
    value:"kathmandu"
  })
  console.log(mapData)
  // const [searchQuery, setSearchQuery] = useState("kathmandu");
  // console.log(searchQuery)
  const [locationName, setLocationName] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Inside handleSearch function
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  // if (!searchQuery.trim()) return;

  setIsSearching(true);
  try {
    // We now call '/osm' instead of the full https URL
    const response = await fetch(
      `/osm/search?q=${encodeURIComponent(mapData.value )}&format=json`, 
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Hamro-Real-State-App' 
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      setMapData(prev => ({
        ...prev,
        latitude: parseFloat(result.lat), 
        longitude: parseFloat(result.lon)
      }));
  
      setLocationName(mapData.value);
      // (parseFloat(result.lat));
      // setLongitude(parseFloat(result.lon));
      // setLocationName(searchQuery);
    } else {
      alert("Location not found. Please try a different search.");
    }
  } catch (err) {
    console.error("Error fetching location:", err);
    alert("Error searching for location.");
  } finally {
    setIsSearching(false);
  }
};
  return (
  
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3">
            Research <span className="text-[#e51013]">Insights</span>
          </h1>
          <p className="text-lg text-slate-600">
            Explore amenities, schools, hospitals, and more in any neighborhood
          </p>
        </div>



        {mapData.latitude && mapData.longitude ? (
          <div className=" shadow-xl shadow-slate-900/5 border-2 rounded-2xl overflow-hidden border-red-200 ">
                  <form onSubmit={handleSearch} className=" p-6 sm:p-8  bg-white ">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Search Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          className="input pl-10 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e51013]/20"
                          value={mapData.value}
                          onChange={(e) => setMapData(prev=>({
                            ...prev,
                            value:e.target.value
                          }))}
                          placeholder="Enter city, address, or neighborhood (e.g. Thamel)"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-[#e51013] text-white font-bold w-full sm:w-auto px-8 py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isSearching ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>
                </form>
          <ResearchInsights
            latitude={mapData.latitude}
            longitude={mapData.longitude}
            propertyName={locationName}
          />
          </div>
        ) : (
          <div className="card p-12 text-center bg-white ">
            <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to explore?</h2>
            <p className="text-slate-500">
              Enter a location above to see local schools, banks, and parks around the area.
            </p>
          </div>
        )}
      </div>
    </div>
  
  );
}