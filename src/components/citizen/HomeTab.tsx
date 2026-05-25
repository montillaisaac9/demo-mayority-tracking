"use client";

import { useState } from "react";
import { Droplets, Lightbulb, ShieldAlert, Trash2, Bell, MapPin } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";
import CitizenMap from "@/components/maps/CitizenMap";

const categories = [
  { id: "agua",      icon: Droplets,    label: "Servicios Públicos",  sub: "Botes de agua, alumbrado",  color: "bg-blue-50 text-blue-600 border-blue-200"   },
  { id: "vialidad",  icon: Lightbulb,   label: "Vialidad y Tránsito", sub: "Baches, semáforos",          color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "seguridad", icon: ShieldAlert, label: "Seguridad Ciudadana", sub: "Alertas",                    color: "bg-red-50 text-red-600 border-red-200"       },
  { id: "aseo",      icon: Trash2,      label: "Aseo Público",        sub: "Recolección de basura",      color: "bg-green-50 text-green-600 border-green-200" },
];

const notifications = [
  { text: "Recolección de basura: Sector Don Bosco — Martes 27 May", time: "hace 2h" },
  { text: "Corte de agua programado: La Granja — 28 May 8am-2pm",    time: "hace 5h" },
];

type Props = { onNewReport: (category?: string) => void };

export default function HomeTab({ onNewReport }: Props) {
  const [anonymous, setAnonymous] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 pb-2">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">N</div>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Alcaldía de Naguanagua</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900">Panel de Reportes Ciudadanos</h1>
        <p className="text-xs text-gray-500 mt-0.5">Selecciona una categoría para reportar</p>
      </div>

      {/* Category Grid — each button opens the report form pre-filled */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onNewReport(cat.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center active:scale-95",
              cat.color
            )}
          >
            <cat.icon className="w-7 h-7" />
            <div>
              <p className="text-xs font-semibold leading-tight">{cat.label}</p>
              <p className="text-[10px] opacity-70 leading-tight mt-0.5">{cat.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Social Protection Banner */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-purple-600 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-purple-900">Protección Social</p>
          <p className="text-[10px] text-purple-700">Niños / Adolescentes (LOPNNA)</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Switch
            checked={anonymous}
            onCheckedChange={setAnonymous}
            className={cn(
              "w-9 h-5 rounded-full transition-colors relative outline-none cursor-pointer",
              anonymous ? "bg-purple-600" : "bg-gray-300"
            )}
          >
            <span className={cn(
              "block w-4 h-4 bg-white rounded-full shadow transition-transform absolute top-0.5",
              anonymous ? "translate-x-4" : "translate-x-0.5"
            )} />
          </Switch>
          <span className="text-[9px] text-purple-700 font-medium">{anonymous ? "Anónimo" : "Normal"}</span>
        </div>
      </div>

      {/* Mapa real */}
      <div className="rounded-xl overflow-hidden border border-slate-200 relative h-44">
        <div className="absolute top-2 left-2 z-[1000] text-[9px] text-slate-700 font-semibold bg-white/80 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
          <MapPin className="w-3 h-3 text-blue-600" /> Naguanagua, Carabobo
        </div>
        <CitizenMap />
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Bell className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">Notificaciones de la Alcaldía</span>
        </div>
        <div className="flex flex-col gap-2">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-700 leading-snug">{n.text}</p>
                <p className="text-[9px] text-gray-400">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
