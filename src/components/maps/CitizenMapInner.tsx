"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getReports, type Report } from "@/lib/store";

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const CAT_COLOR: Record<string, string> = {
  agua:      "#3b82f6",
  vialidad:  "#f59e0b",
  seguridad: "#ef4444",
  aseo:      "#22c55e",
};

const makeIcon = (color: string, isNew: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2.5px solid white;
      box-shadow:0 1px 6px rgba(0,0,0,.45);
      ${isNew ? "outline:2px solid " + color + ";outline-offset:3px;" : ""}
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const CENTER: [number, number] = [10.2005, -67.9970];

function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  return null;
}

export default function CitizenMapInner() {
  const [reports, setReports] = useState<Report[]>([]);

  const load = () => setReports(getReports().filter((r) => r.coords));

  useEffect(() => {
    fixLeafletIcons();
    load();
    window.addEventListener("store-update", load);
    return () => window.removeEventListener("store-update", load);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark reports created in the last 10 minutes as "new"
  const tenMinAgo = Date.now() - 10 * 60 * 1000;

  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="w-full h-full rounded-xl"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <InvalidateSizeOnMount />

      {reports.map((r) => {
        const color = CAT_COLOR[r.category] ?? "#64748b";
        const isNew = new Date(r.createdAt).getTime() > tenMinAgo;
        return (
          <Marker
            key={r.id}
            position={[r.coords!.lat, r.coords!.lng]}
            icon={makeIcon(color, isNew)}
          >
            <Popup>
              <div className="text-xs leading-snug">
                <p className="font-bold text-gray-800">{r.id}</p>
                <p className="text-gray-600">{r.subtype}</p>
                <p className="text-gray-500 text-[11px] mt-0.5">{r.location}</p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold
                  ${r.status === "Resuelto"   ? "bg-green-100 text-green-700"  :
                    r.status === "Pendiente"  ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"}`}>
                  {r.status}
                </span>
                {isNew && <span className="ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">Nuevo</span>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
