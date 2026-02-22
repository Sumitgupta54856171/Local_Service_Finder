"use client";

import dynamic from "next/dynamic";

const LandingMap = dynamic(() => import("../ui/landingmap"), { ssr: false });

export default function PublicPage() {
  return (
    <div>
      <LandingMap />
    </div>
  );
}