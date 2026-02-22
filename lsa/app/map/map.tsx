"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default icon issue in Leaflet + React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center: [number, number] = [19.0760, 72.8777]; // Mumbai

export default function AtmBankMap() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [pois, setPois] = useState<any[]>([]); // ATM/Bank data

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  // Fetch nearby ATMs + Banks using Overpass API
  useEffect(() => {
    const loc = userPos || center;
    if (!loc) return;

    // Overpass QL query: nodes/ways with amenity=atm or amenity=bank within ~5km
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="atm"](around:5000,${loc[0]},${loc[1]});
        node["amenity"="bank"](around:5000,${loc[0]},${loc[1]});
        way["amenity"="atm"](around:5000,${loc[0]},${loc[1]});
        way["amenity"="bank"](around:5000,${loc[0]},${loc[1]});
      );
      out body;
      >;
      out skel qt;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const features = data.elements
          .filter((el: any) => el.type === "node" && el.lat && el.lon) // Only points for simplicity
          .map((el: any) => ({
            lat: el.lat,
            lon: el.lon,
            name: el.tags?.name || el.tags?.operator || "Unknown ATM/Bank",
            type: el.tags?.amenity || "Unknown",
          }));
        setPois(features);
      })
      .catch((err) => console.error("Overpass error:", err));
  }, [userPos]);

  return (
    <div>
      <h1>Nearby ATM & Bank Finder (Free with Leaflet + OSM)</h1>
      <MapContainer
        center={(userPos ?? center) as [number, number]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPos && (
          <Marker position={userPos}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {pois.map((poi, idx) => (
          <Marker key={idx} position={[poi.lat, poi.lon]}>
            <Popup>
              <b>{poi.name}</b><br />
              Type: {poi.type.toUpperCase()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ marginTop: "20px" }}>
        <h2>Found: {pois.length} ATMs/Banks</h2>
        <ul>
          {pois.map((p, i) => (
            <li key={i}>
              {p.name} ({p.type}) at [{p.lat.toFixed(4)}, {p.lon.toFixed(4)}]
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}