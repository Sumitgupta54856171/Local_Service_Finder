"use client";

import dynamic from "next/dynamic";
import { ResizableHandleDemo } from "./resizescreen";

const LandingMap = dynamic(() => import("../ui/landingmap"), { ssr: false });

export default function PublicPage() {
  return (
    <div>
     <ResizableHandleDemo/>
    </div>
  );
}