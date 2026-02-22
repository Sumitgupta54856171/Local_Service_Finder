import React from 'react';
import { Star, Navigation, CornerUpRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


// Main Component jo aap apne actual code me use karoge
export default function LocationCard({ data, distance}) {
  return (
    <>
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-4 p-4">
        {Array.isArray(data) ? data.map((item) => (
          <div key={item.id || item.name} className="bg-white rounded-xl p-4 w-full font-sans shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md hover:border-blue-100 group">
            {/* Top Section */}
            <div className="flex items-start gap-4">
              {/* Image Box with Full Name */}
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden shadow-sm bg-blue-600 flex items-center justify-center p-2 group-hover:bg-blue-700 transition-colors">
                <span className="text-white text-[10px] font-bold text-center leading-tight break-words uppercase">
                  {item.name.substring(0, 3)}
                </span>
              </div>
              {/* Info Content */}
              <div className="flex flex-col flex-1 pt-0.5">
                <h3 className="text-slate-900 font-bold text-lg leading-snug mb-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-sm mb-2 font-medium">
                  {item.category}
                </p>
                {/* Rating & Status Row */}
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1.5" />
                  <span className="text-slate-900 font-bold mr-1">{typeof item.rating === "number" ? item.rating.toFixed(1) : "0.0"}</span>
                  <span className="text-slate-400 mr-2">(1.2k)</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                  <span className="text-emerald-600 font-semibold ml-1">Open Now</span>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="h-px bg-slate-100 w-full mt-4 mb-4"></div>
            {/* Bottom Section (Distance & Actions) */}
            <div className="flex items-center justify-between">
              {/* User Distance */}
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm pl-1">
                <Navigation className="w-4 h-4 -rotate-45 text-blue-500" />
                <span>{distance} km away</span>
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-2">
                <Link 
                  href={`/public/near/service/category/detail/${item.id}`}
                  className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg transition-all border border-slate-200 hover:border-blue-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <p>No services available</p>
          </div>
        )}
      </div>
    </ScrollArea>
    </>
  );
}