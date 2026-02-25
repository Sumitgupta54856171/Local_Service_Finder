'use client'

import dynamic from "next/dynamic"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { use, useEffect,useState,Suspense,lazy } from "react"
import axios from "axios"


import {SpinnerCustom} from "@/app/ui/loadingspin"

const LocationCard = lazy(() => import("../ui/Locationcard"))




const LandingMap = dynamic(() => import("../ui/landingmap"), { ssr: false })

export function ResizableHandleDemo() {
    const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
     const controller = new AbortController(); 
const fetchData = async () => {
      try {
        setLoading(true);
        
         const limit=10;
         const skip=20 // API se data fetch karna
        const response = await axios.get(`http://localhost:8000/api/public/${limit}/${skip}`, { withCredentials: true, signal: controller.signal });

        // If paginated, use response.results
        if (response && Array.isArray(response.data.results)) {
          setServices(response.data.results);
        } else if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Public services fetch error:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">LSA Service Finder</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</button>
          <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">List Your Service</button>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full md:min-w-full"
        >
          <ResizablePanel defaultSize={35} minSize={30}>
            <div className="flex flex-col h-full p-4 space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900">Welcome to LSA</h1>
                <p className="text-slate-500 mt-2">Find and explore local services near you.</p>
              </div>
              <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                <LocationCard data={services} distance={5} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="w-1 bg-transparent hover:bg-blue-100 transition-colors" />
          <ResizablePanel defaultSize={65}>
            <div className="flex h-full w-full p-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <SpinnerCustom className="size-50 text-blue-600" />
                  </div>
                }>
                  <LandingMap data={services} loading={loading} />
                </Suspense>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
