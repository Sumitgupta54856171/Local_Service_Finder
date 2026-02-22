'use client'

import {useSearchParams} from "next/navigation"
import {useEffect,useState} from "react"
import axios from "axios"
import { 
  Star, Navigation, ArrowLeft, Share2, MapPin, Calendar 
} from 'lucide-react';
import { useParams } from 'next/navigation'
export default  function DetailPage({params}) {
  const searchParams = useSearchParams();
  
  
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (params.id) {
        try {
          const response = await axios.get(`http://localhost:8000/api/public/${params.id}`);
          // If response.data is an array, use the first item
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          setService(data);
        } catch (error) {
          console.error("Error fetching service details:", error);
        }
      }
    };
    fetchServiceData();
  }, [params.id]);

  

const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(service?.name || "Service")}&background=1a73e8&color=fff&size=150&rounded=true&font-size=0.35`;

  // Cover image (abstract dark map background)
  const coverImage = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80";

  // Formatting the created_at Date
  const dateObj = new Date(service?.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // Safe access for coordinates
  const latitude = service?.location && Array.isArray(service.location.coordinates)
    ? service.location.coordinates[1]
    : null;
  const longitude = service?.location && Array.isArray(service.location.coordinates)
    ? service.location.coordinates[0]
    : null;

  return (
    <div className="min-h-screen bg-white font-sans pb-24 relative overflow-x-hidden">
      {/* Hero Cover Section */}
      <div className="relative h-64 sm:h-80 w-full">
        <div className="absolute inset-0 bg-white/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
        <img 
          src={coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover grayscale-[10%] brightness-100"
        />
        {/* Back Button */}
        <button className="absolute top-8 left-6 sm:left-10 z-20 bg-white/80 backdrop-blur-md p-2.5 rounded-full text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      {/* Main Content Card */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <img 
                  src={avatarUrl} 
                  alt={service?.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-lg border-4 border-white bg-gray-100 shrink-0"
                />
                {/* Title & Meta */}
                <div className="flex flex-col pt-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide mb-1">
                    {service?.name}
                  </h1>
                  <p className="text-gray-500 font-medium text-[15px] mb-2">
                    {service?.category}
                  </p>
                  {service?.rating && (
                    <div className="flex items-center text-[14px]">
                      <Star className="w-[16px] h-[16px] text-yellow-400 fill-yellow-400 mr-1.5" />
                      <span className="text-gray-900 font-bold">{service.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-colors border border-gray-200 flex justify-center items-center">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="flex-[2] sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                  <Navigation className="w-5 h-5 -rotate-45" />
                  Navigate
                </button>
              </div>
            </div>
            {/* Content Grid for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Location Data Card */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <h2 className="text-gray-900 text-base font-bold flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Location Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Latitude</span>
                    <span className="text-gray-900 font-mono">
                      {service && service.location && Array.isArray(service.location.coordinates) && typeof service.location.coordinates[1] === 'number'
                        ? service.location.coordinates[1].toFixed(6)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Longitude</span>
                    <span className="text-gray-900 font-mono">
                      {service && service.location && Array.isArray(service.location.coordinates) && typeof service.location.coordinates[0] === 'number'
                        ? service.location.coordinates[0].toFixed(6)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-gray-500">Distance from you</span>
                    <span className="text-green-600 font-semibold">{service?.distance}</span>
                  </div>
                </div>
              </div>
              {/* System Info Card */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <h2 className="text-gray-900 text-base font-bold flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  System Record
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Date Added</span>
                    <span className="text-gray-900 font-medium">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Category Type</span>
                    <span className="text-gray-900 font-medium">{service?.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-gray-500">Service ID</span>
                    <span className="text-gray-900 font-mono">#{service?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}