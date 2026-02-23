"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getPublicServices } from "@/app/api/public-api";
// Fix default icon in Next.js + Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Your backend service shape (example)
interface Service {
  name: string;
  category: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat] – GeoJSON order
  };
  rating: number;
}

export default function LandingMap({data,loading}) {
  const services = data;

  const mapRef = useRef<L.Map | null>(null); // To access map instance later

  // Fetch via public-api (uses Next.js proxy in browser – no CORS).


  // Auto-fit map to all markers once services load and map is ready
  const FitToMarkers = () => {
    const map = useMap();
    mapRef.current = map; // Save ref if needed later

    useEffect(() => {
      if (Array.isArray(services) && services.length === 0 || !map) return;

      const bounds = L.latLngBounds([]); // Empty bounds

      Array.isArray(services)&&services.forEach((service) => {
        const [lng, lat] = service.location.coordinates;
        bounds.extend([lat, lng]); // Leaflet: [lat, lng]
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50], // Small padding so markers aren't at edge
          maxZoom: 15,       // Don't zoom too close if only 1-2 points
        });
      } else {
        // Fallback if invalid (very rare)
        map.setView([0, 0], 2); // World view
      }
    }, [services, map]);

    return null;
  };

  if (loading) {
    return <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading services from backend...
    </div>;
  }

  if (Array.isArray(services) && services.length === 0) {
    return (
      <div>
        <h1>Service Finder Map</h1>
        <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>
          No services found in backend
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Service Finder Map – All Services Worldwide</h1>

      <MapContainer
        // NO center or zoom here → we use FitToMarkers to set dynamically
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitToMarkers />

        {Array.isArray(services)&&services.map((service, index) => {
          const [lng, lat] = service.location.coordinates;
          const position: [number, number] = [lat, lng]; // Leaflet order

          return (
            <Marker key={index} position={position}>
              <Popup>
                <strong>{service.name}</strong><br />
                Category: {service.category}<br />
                Rating: {service.rating} ★
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}