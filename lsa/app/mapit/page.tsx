"use client";

import dynamic from "next/dynamic";

const ServiceFinderMap = dynamic(() => import("../ui/landingmap"), { ssr: false });

export default function MapPage() {
  return (
    <div>
      <ServiceFinderMap />
    </div>
  );
}