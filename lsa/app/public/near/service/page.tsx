'use client';

import dynamic from "next/dynamic";

const NearMap = dynamic(() => import("../service/servicemap"), { ssr: false });

export default function NearPage() {
  return (
    <div>
      <NearMap />
    </div>
  );
}