"use client";

import dynamic from "next/dynamic";

const AtmBankMap = dynamic(() => import("./map"), { ssr: false });

export default function MapPage() {
  return (
    <div>
      <AtmBankMap />
    </div>
  );
}