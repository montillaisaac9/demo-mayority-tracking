"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    background:#2563eb;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,.45);
    transform:rotate(-45deg);">
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const CENTER: [number, number] = [10.2005, -67.9970];

type Props = { onLocationSelect: (lat: number, lng: number, address: string) => void };

function ClickHandler({ onLocationSelect }: Props) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Simulate reverse geocoding with sector names based on rough coords
      const sectors = [
        { name: "Av. Universidad, Naguanagua",     minLat: 10.195, maxLat: 10.210, minLng: -68.005, maxLng: -67.990 },
        { name: "Urb. La Granja, Naguanagua",      minLat: 10.190, maxLat: 10.200, minLng: -67.995, maxLng: -67.975 },
        { name: "Sector Don Bosco, Naguanagua",    minLat: 10.200, maxLat: 10.215, minLng: -68.010, maxLng: -67.995 },
        { name: "El Viñedo, Naguanagua",            minLat: 10.205, maxLat: 10.220, minLng: -67.990, maxLng: -67.970 },
        { name: "Urb. Bárbula, Naguanagua",        minLat: 10.185, maxLat: 10.198, minLng: -68.005, maxLng: -67.985 },
      ];
      const match = sectors.find(
        (s) => lat >= s.minLat && lat <= s.maxLat && lng >= s.minLng && lng <= s.maxLng
      );
      const address = match?.name ?? `Naguanagua (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      onLocationSelect(lat, lng, address);
    },
  });
  return null;
}

export default function ReportMapInner({ onLocationSelect }: Props) {
  const [pin, setPin] = useState<[number, number] | null>(null);

  useEffect(() => { fixLeafletIcons(); }, []);

  const handleSelect = (lat: number, lng: number, address: string) => {
    setPin([lat, lng]);
    onLocationSelect(lat, lng, address);
  };

  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onLocationSelect={handleSelect} />
      {pin && <Marker position={pin} icon={pinIcon} />}
    </MapContainer>
  );
}
