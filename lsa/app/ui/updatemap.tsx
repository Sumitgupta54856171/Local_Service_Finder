"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon (important in Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Example: Your backend data (replace with fetch from your API)
const mockBackendData = [
  {
    name: "HDFC Shop",
    category: "Shop",
    location: { type: "Point", coordinates: [72.8777, 19.0760] }, // Mumbai example [lng, lat]
    rating: 4.2,
  },
  {
    name: "SBI ATM",
    category: "ATM",
    location: { type: "Point", coordinates: [72.8800, 19.0800] },
    rating: 4.5,
  },
  // Add more from your backend
];

export default function ServiceFinderMap() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [services, setServices] = useState<any[]>([]); // Your data array

  // Get user location (optional)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {}
      );
    }
  }, []);

  // Load data from backend (replace mock with real fetch)
  useEffect(() => {
    // Example: Fetch from your backend API
    // fetch('/api/services?lat=19.0760&lng=72.8777&radius=5000')
    //   .then(res => res.json())
    //   .then(data => setServices(data));

    // For now, use mock data like your example
    setServices(mockBackendData);
  }, []);

  const defaultCenter: [number, number] = [19.0760, 72.8777]; // Mumbai

  return (
    <div>
      <h1>Service Finder Map (Only Name, Category, Rating)</h1>

      <MapContainer
        center={userPos || defaultCenter}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userPos && (
          <Marker position={userPos}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Render ONLY your data – no extra OSM stuff */}
        {services.map((service, index) => {
          // coordinates are [lng, lat] in GeoJSON → swap to [lat, lng] for Leaflet
          const position: [number, number] = [
            service.location.coordinates[1],
            service.location.coordinates[0],
          ];

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

      {/* Optional: List view below map */}
      <div style={{ marginTop: "20px" }}>
        <h2>Services Found: {services.length}</h2>
        <ul>
          {services.map((s, i) => (
            <li key={i}>
              {s.name} ({s.category}) – Rating: {s.rating}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}