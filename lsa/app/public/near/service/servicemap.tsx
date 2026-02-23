"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { CardImage } from "@/app/ui/Listcard";

 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios";
import { SpinnerCustom } from "@/app/ui/loadingspin";
import LocationCard from "@/app/ui/Locationcard";
import Link from "next/link";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Service {
  id: string;
  lat: number;
  lon: number;
  name?: string;
  category: string;
  rating?: number; // OSM rarely has rating, but we can show if present
}


export default function NearbyServiceMap() {
  const [lat, setLat] = useState<number | "">(19.0760);
  const [lng, setLng] = useState<number | "">(72.8777);
  const [radius, setRadius] = useState<number | "">(5000);
  const [category, setCategory] = useState<string>("atm");
  const [services, setServices] = useState<Service[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // For lazy loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Helper: ensure radius is in kilometers
  const getRadiusKm = (r: number | "") => {
    if (!r || typeof r !== "number") return 1; // default 1km
    // If radius is > 100, assume meters, convert to km
    return r >= 100 ? r / 1000 : r;
  };

  const searchServices = async () => {
    if (!lat || !lng || !radius || !category) {
      setError("Please fill all fields");
      return;
    }


    setLoading(true);
    setError(null);
    setServices([]);
    try {
      const response = await axios.get(`http://localhost:8000/api/public/search/nearby?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`, { withCredentials: true });
      console.log("API Response:", response.data);
      // Map backend response to Service[]
      const features: Service[] = (response.data.results || []).map((item: any) => ({
        id: item.id.toString(),
        lat: item.location?.coordinates?.[1], // GeoJSON: [lng, lat]
        lon: item.location?.coordinates?.[0],
        name: item.name,
        category: item.category,
        rating: typeof item.rating === "number" ? item.rating : undefined,
      }));
      if (features.length === 0) {
        setError("No services found for the given search.");
      } else {
        setError(null);
      }
      setServices(features);
      setVisibleCount(10);
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fit bounds when services change
  const FitBounds = () => {
    const map = useMap();
    mapRef.current = map;
    useEffect(() => {
      if (services.length > 0) {
        const bounds = L.latLngBounds(
          services.map((s) => [s.lat, s.lon])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else if (lat && lng) {
        map.setView([Number(lat), Number(lng)], 14);
      }
    }, [services, lat, lng, map]);
    return null;
  };

  // --- UI Styles ---
  const styles = {
    container: {
      maxWidth: 900,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      padding: 32,
      fontFamily: "'Inter', Arial, sans-serif",
    } as React.CSSProperties,
    header: {
      fontSize: 32,
      fontWeight: 700,
      marginBottom: 24,
      color: "#1a237e",
      letterSpacing: 0.5,
      textAlign: "center" as const,
    },
    panel: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 16,
      alignItems: "center",
      background: "#f5f7fa",
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      justifyContent: "center" as const,
    },
    label: {
      fontWeight: 500,
      color: "#333",
      marginRight: 4,
    },
    input: {
      border: "1px solid #bdbdbd",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 16,
      outline: "none",
      minWidth: 110,
      background: "#fff",
      transition: "border 0.2s",
    },
    select: {
      border: "1px solid #bdbdbd",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 16,
      background: "#fff",
      minWidth: 140,
    },
    button: {
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "10px 22px",
      fontWeight: 600,
      fontSize: 16,
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
      transition: "background 0.2s",
      opacity: loading ? 0.7 : 1,
    },
    map: {
      height: 500,
      width: "100%",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      marginBottom: 24,
    },
    error: {
      color: "#d32f2f",
      background: "#fff3f3",
      borderRadius: 8,
      padding: "10px 18px",
      margin: "0 0 18px 0",
      textAlign: "center" as const,
      fontWeight: 500,
    },
    results: {
      marginTop: 24,
      background: "#f8fafc",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: "#1976d2",
      marginBottom: 12,
    },
    resultList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      fontSize: 16,
    },
    resultItem: {
      padding: "8px 0",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    resultName: {
      fontWeight: 500,
      color: "#222",
    },
    resultCategory: {
      color: "#607d8b",
      fontSize: 15,
    },
    resultRating: {
      color: "#ffb300",
      fontWeight: 600,
      fontSize: 15,
    },
  };



  const items =[
  { value: "atm", label: "ATM" },
  { value: "bank", label: "Bank" },
  { value: "hospital", label: "Hospital" },
  { value: "shop", label: "Shop" },
  { value: "all", label: "All Services" },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span role="img" aria-label="map" style={{ marginRight: 10 }}>
          🗺️
        </span>
        Nearby Services Finder
      </div>

      <div style={styles.panel}>
        <label htmlFor="lat-input" style={styles.label}>Latitude:</label>
        <input
          id="lat-input"
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value ? Number(e.target.value) : "")}
          step="any"
          style={styles.input}
        />
        <label htmlFor="lng-input" style={styles.label}>Longitude:</label>
        <input
          id="lng-input"
          type="number"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value ? Number(e.target.value) : "")}
          step="any"
          style={styles.input}
        />
        <label htmlFor="radius-input" style={styles.label}>Radius (meters):</label>
        <input
          id="radius-input"
          type="number"
          placeholder="Radius (meters)"
          value={radius}
          onChange={(e) => setRadius(e.target.value ? Number(e.target.value) : "")}
          style={styles.input}
        />
        <label htmlFor="category-select" style={styles.label}>Category:</label>
          <Select items={items} >
      <SelectTrigger className="w-full max-w-48" ondefaultselect={(value) => setCategory(value)}>
        <SelectValue />
      </SelectTrigger >
      <SelectContent >
        <SelectGroup >
          <SelectLabel>Category</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value} onSelect={() => setCategory(item.value)}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>

        <button onClick={searchServices} disabled={loading} style={styles.button}>
          {loading ? <SpinnerCustom size={16} /> : "Search"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.map}>
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds />
          {/* Center marker for input lat/lng */}
          {lat && lng && (
            <Marker position={[Number(lat), Number(lng)]} opacity={0.6}>
              <Popup>Search Center (You)</Popup>
            </Marker>
          )}
          {/* Service markers */}
          {services.map((service) => (
            <Marker key={service.id} position={[service.lat, service.lon]}>
              <Popup>
                <strong>{service.name}</strong><br />
                Category: {service.category}<br />
                {service.rating && <><span style={{ color: '#ffb300' }}>Rating: {service.rating} ★</span></>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {services.length > 0 && (
         <LocationCard data={services} distance={5} />
       
      )}
<div>
 
</div>

</div>
    
  );
}