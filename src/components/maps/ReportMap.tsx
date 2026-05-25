"use client";

import dynamic from "next/dynamic";

type Props = { onLocationSelect: (lat: number, lng: number, address: string) => void };

const ReportMapInner = dynamic(() => import("./ReportMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <span className="text-xs text-slate-400">Cargando mapa…</span>
    </div>
  ),
});

export default function ReportMap({ onLocationSelect }: Props) {
  return <ReportMapInner onLocationSelect={onLocationSelect} />;
}
