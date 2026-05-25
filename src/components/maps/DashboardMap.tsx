"use client";

import dynamic from "next/dynamic";

const DashboardMapInner = dynamic(() => import("./DashboardMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <span className="text-xs text-slate-500">Cargando mapa…</span>
    </div>
  ),
});

export default function DashboardMap() {
  return <DashboardMapInner />;
}
