"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getReports, type Report } from "@/lib/store";

// ── Leaflet icon fix ──────────────────────────────────────────────────────────
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// ── Category colours ──────────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  agua:      "#3b82f6",
  vialidad:  "#f59e0b",
  seguridad: "#ef4444",
  aseo:      "#22c55e",
};

const PRIORITY_RGBA: Record<string, string> = {
  Alta:  "239,68,68",
  Media: "249,115,22",
  Baja:  "234,179,8",
};

// ── Icon factories ────────────────────────────────────────────────────────────
const makeReportIcon = (color: string, priority: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2.5px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.5);
      ${priority === "Alta" ? "animation:pulse 1.5s infinite;" : ""}
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const makeClusterIcon = (color: string, count: number) =>
  L.divIcon({
    className: "",
    html: `<div style="
      background:${color};color:#fff;font-size:9px;font-weight:700;
      padding:3px 8px;border-radius:999px;white-space:nowrap;
      box-shadow:0 2px 6px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.3);
    ">${count} reportes</div>`,
    iconAnchor: [0, 0],
  });

// ── Haversine distance (meters) ───────────────────────────────────────────────
function distanceM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Cluster reports within RADIUS metres ─────────────────────────────────────
const CLUSTER_RADIUS = 300;

type Cluster = {
  lat: number; lng: number;
  reports: Report[];
  dominantCategory: string;
  priority: string;
};

function clusterReports(reports: Report[]): Cluster[] {
  const located = reports.filter((r) => r.coords);
  const clusters: Cluster[] = [];

  for (const r of located) {
    const { lat, lng } = r.coords!;
    const found = clusters.find((c) => distanceM(c.lat, c.lng, lat, lng) < CLUSTER_RADIUS);
    if (found) {
      found.reports.push(r);
      // Recalculate centroid
      found.lat = found.reports.reduce((s, x) => s + x.coords!.lat, 0) / found.reports.length;
      found.lng = found.reports.reduce((s, x) => s + x.coords!.lng, 0) / found.reports.length;
    } else {
      clusters.push({ lat, lng, reports: [r], dominantCategory: r.category, priority: r.priority });
    }
  }

  // Determine dominant category and highest priority per cluster
  for (const c of clusters) {
    const catCounts: Record<string, number> = {};
    for (const r of c.reports) catCounts[r.category] = (catCounts[r.category] ?? 0) + 1;
    c.dominantCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];
    c.priority = c.reports.some((r) => r.priority === "Alta")
      ? "Alta"
      : c.reports.some((r) => r.priority === "Media") ? "Media" : "Baja";
  }

  return clusters;
}

// ── Map invalidate helper ─────────────────────────────────────────────────────
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  return null;
}

const CENTER: [number, number] = [10.2005, -67.9960];

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardMapInner() {
  const [reports, setReports] = useState<Report[]>([]);

  const load = () => setReports(getReports());

  useEffect(() => {
    fixLeafletIcons();
    load();
    window.addEventListener("store-update", load);
    return () => window.removeEventListener("store-update", load);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clusters = clusterReports(reports);
  // Reports without coords — no marker, but counted in legend
  const withoutCoords = reports.filter((r) => !r.coords);

  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom={true}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <InvalidateSizeOnMount />

      {clusters.map((cluster, i) => {
        const color = CAT_COLOR[cluster.dominantCategory] ?? "#94a3b8";
        const rgba  = PRIORITY_RGBA[cluster.priority] ?? "148,163,184";
        const count = cluster.reports.length;
        // Heat rings scaled by count (max radius 500m for 20+ reports)
        const baseR = Math.min(80 + count * 25, 500);

        return (
          <div key={i}>
            {/* Heat circles */}
            {[baseR, baseR * 0.6, baseR * 0.3].map((r, j) => (
              <Circle
                key={j}
                center={[cluster.lat, cluster.lng]}
                radius={r}
                pathOptions={{
                  color: "transparent",
                  fillColor: `rgb(${rgba})`,
                  fillOpacity: 0.08 + j * 0.08,
                }}
              />
            ))}

            {/* Cluster marker or single report marker */}
            {count > 1 ? (
              <Marker
                position={[cluster.lat, cluster.lng]}
                icon={makeClusterIcon(color, count)}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold mb-1">{count} reportes en esta zona</p>
                    {cluster.reports.slice(0, 4).map((r) => (
                      <p key={r.id} className="text-gray-600">
                        {r.id} · {r.subtype}
                      </p>
                    ))}
                    {count > 4 && <p className="text-gray-400">+{count - 4} más…</p>}
                  </div>
                </Popup>
              </Marker>
            ) : (
              <Marker
                position={[cluster.lat, cluster.lng]}
                icon={makeReportIcon(color, cluster.priority)}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{cluster.reports[0].id}</p>
                    <p className="text-gray-600">{cluster.reports[0].categoryLabel}</p>
                    <p className="text-gray-600">{cluster.reports[0].subtype}</p>
                    <p className="text-gray-500 mt-1">{cluster.reports[0].location}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold
                      ${cluster.reports[0].status === "Resuelto" ? "bg-green-100 text-green-700" :
                        cluster.reports[0].status === "Pendiente" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"}`}>
                      {cluster.reports[0].status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )}
          </div>
        );
      })}

      {/* Overlay: counter for reports without coords */}
      {withoutCoords.length > 0 && (
        <Marker
          position={[10.1940, -67.9890]}
          icon={L.divIcon({
            className: "",
            html: `<div style="
              background:#475569;color:#cbd5e1;font-size:9px;font-weight:600;
              padding:3px 8px;border-radius:999px;white-space:nowrap;
              box-shadow:0 1px 4px rgba(0,0,0,.4);border:1px solid #64748b;
            ">📋 ${withoutCoords.length} sin ubicación</div>`,
            iconAnchor: [0, 0],
          })}
        >
          <Popup>
            <p className="text-xs font-semibold">{withoutCoords.length} reporte(s) sin coordenadas</p>
            <p className="text-[11px] text-gray-500">Creados vía chatbot o sin pin en el mapa</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
