"use client";

import dynamic from "next/dynamic";

const CitizenMapInner = dynamic(() => import("./CitizenMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
      <span className="text-xs text-slate-400">Cargando mapa…</span>
    </div>
  ),
});

export default function CitizenMap() {
  return <CitizenMapInner />;
}
