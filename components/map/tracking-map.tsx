"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  lat: number;
  lng: number;
  label: string;
  type: "origin" | "destination" | "current";
}

function divIcon(type: MapPoint["type"]) {
  const colors: Record<MapPoint["type"], string> = {
    origin: "#1d54f1",
    destination: "#10b981",
    current: "#ff9d00",
  };
  const pulse =
    type === "current"
      ? `<span style="position:absolute;inset:0;border-radius:9999px;background:${colors.current};opacity:.4;animation:pulse-ring 1.8s ease-out infinite"></span>`
      : "";
  return L.divIcon({
    className: "swiftship-marker",
    html: `<div style="position:relative;width:22px;height:22px;display:grid;place-items:center">
        ${pulse}
        <span style="width:16px;height:16px;border-radius:9999px;background:${colors[type]};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>
      </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 11);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [points, map]);
  return null;
}

export default function TrackingMap({ points }: { points: MapPoint[] }) {
  const center: [number, number] =
    points.length > 0 ? [points[0].lat, points[0].lng] : [5.6037, -0.187];
  const line = points
    .filter((p) => p.type !== "destination")
    .map((p) => [p.lat, p.lng]) as [number, number][];
  const full = points.map((p) => [p.lat, p.lng]) as [number, number][];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
      style={{ minHeight: 320 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {full.length > 1 && (
        <Polyline
          positions={full}
          pathOptions={{ color: "#94a3b8", weight: 2, dashArray: "6 8" }}
        />
      )}
      {line.length > 1 && (
        <Polyline
          positions={line}
          pathOptions={{ color: "#1d54f1", weight: 3 }}
        />
      )}
      {points.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]} icon={divIcon(p.type)}>
          <Popup>
            <strong className="capitalize">{p.type}</strong>
            <br />
            {p.label}
          </Popup>
        </Marker>
      ))}
      <FitBounds points={points} />
    </MapContainer>
  );
}
