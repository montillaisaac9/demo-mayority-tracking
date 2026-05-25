"use client";

import { mockReports } from "@/lib/mockData";
import { cn } from "@/lib/cn";
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";

const statusConfig = {
  "Resuelto":   { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  "En Proceso": { icon: Clock,       color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "Pendiente":  { icon: AlertCircle, color: "text-red-600",   bg: "bg-red-50 border-red-200"   },
};

const priorityColor = {
  "Alta": "bg-red-100 text-red-700",
  "Media": "bg-amber-100 text-amber-700",
  "Baja": "bg-green-100 text-green-700",
};

type Props = { onNewReport: (category?: string) => void };

export default function MyReportsTab({ onNewReport }: Props) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-base font-bold text-gray-900">Mis Reportes</h2>
          <p className="text-xs text-gray-500">Historial de reportes enviados</p>
        </div>
        <button
          onClick={() => onNewReport()}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nuevo
        </button>
      </div>

      {mockReports.map((report) => {
        const cfg = statusConfig[report.status as keyof typeof statusConfig];
        return (
          <div key={report.id} className={cn("rounded-xl border-2 p-3", cfg.bg)}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <cfg.icon className={cn("w-4 h-4 shrink-0", cfg.color)} />
                <span className="text-xs font-bold text-gray-800">{report.id}</span>
              </div>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", priorityColor[report.priority as keyof typeof priorityColor])}>
                {report.priority}
              </span>
            </div>
            <p className="text-xs text-gray-700 mt-1.5 leading-snug">{report.detail}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-500">{report.category}</span>
              <span className="text-[10px] text-gray-400">{report.date}</span>
            </div>
            <div className="mt-1.5">
              <span className={cn("text-[10px] font-semibold", cfg.color)}>{report.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
