"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardMetrics, chartData, topChatbotTopics, priorityMatrix } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Droplets, Zap, ShieldAlert, MessageSquare, Map, AlertTriangle, LogOut, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { clearAuth } from "@/lib/auth";
import DashboardMap from "@/components/maps/DashboardMap";
import ReportsPanel from "./ReportsPanel";
import MastersPanel from "./MastersPanel";

type DashTab = "map" | "reports" | "masters";

const DASH_TABS: { id: DashTab; icon: React.ElementType; label: string; short: string }[] = [
  { id: "map",     icon: Map,           label: "Mapa Operativo",      short: "Mapa"      },
  { id: "reports", icon: ClipboardList, label: "Gestión de Reportes", short: "Reportes"  },
  { id: "masters", icon: Settings,      label: "Maestros",            short: "Maestros"  },
];

const levelColor: Record<number, string> = {
  0: "bg-emerald-500",
  1: "bg-yellow-400",
  2: "bg-orange-500",
  3: "bg-red-600",
};
const levelLabel: Record<number, string> = {
  0: "Normal",
  1: "Bajo",
  2: "Medio",
  3: "Alto",
};

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashTab>("map");

  const logout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-700 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">N</div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
              <span className="hidden sm:inline">Panel Ejecutivo — </span>Alcaldía de Naguanagua
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">Sistema de Inteligencia Municipal · Tiempo Real</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Sistema Activo
          </div>
          {/* pulse dot on mobile */}
          <div className="flex sm:hidden w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <button
            onClick={logout}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-200 text-[11px] transition-colors border border-slate-700 hover:border-slate-500 rounded-lg px-2 py-1"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-0.5 sm:gap-1 px-2 sm:px-4 pt-2 sm:pt-3 shrink-0 border-b border-slate-800">
        {DASH_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-t-lg border-b-2 transition-all",
              activeTab === tab.id
                ? "border-blue-500 text-blue-400 bg-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            <tab.icon className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">{tab.short}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Reports & Masters panels */}
      {activeTab === "reports" && (
        <div className="flex-1 overflow-hidden">
          <ReportsPanel />
        </div>
      )}
      {activeTab === "masters" && (
        <div className="flex-1 overflow-hidden">
          <MastersPanel />
        </div>
      )}

      {/* Map tab — responsive: stacked on mobile, 3-col on desktop */}
      {activeTab === "map" && (
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[240px_1fr_240px] gap-3 p-3 overflow-y-auto lg:overflow-hidden">

          {/* CENTER — Map: first on mobile */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col order-1 lg:order-2 h-64 sm:h-80 lg:h-auto lg:overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-700 shrink-0">
              <Map className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300 truncate">Mapa Operativo — Naguanagua</span>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <DashboardMap />
            </div>
            <div className="flex items-center gap-3 px-3 py-1.5 border-t border-slate-700 shrink-0 flex-wrap">
              <span className="text-[9px] text-slate-500">Densidad:</span>
              {[
                { label: "Alta",  cls: "bg-red-500"   },
                { label: "Media", cls: "bg-orange-500" },
                { label: "Baja",  cls: "bg-yellow-400" },
                { label: "Info",  cls: "bg-green-500"  },
              ].map(({ label, cls }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={cn("w-2 h-2 rounded-full", cls)} />
                  <span className="text-[9px] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL — Stats & AI: second on mobile */}
          <div className="flex flex-col gap-3 order-2 lg:order-3 lg:overflow-y-auto">

            {/* Real-time stats */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Tiempo Real</span>
              </div>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                {[
                  { value: "1,521", label: "Reportes",    color: "text-blue-400"   },
                  { value: "2,053", label: "Alertas",     color: "text-red-400"    },
                  { value: "312",   label: "Resueltos",   color: "text-emerald-400"},
                  { value: "89%",   label: "Satisfacción",color: "text-purple-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-900 rounded-lg p-2 text-center">
                    <p className={cn("text-base sm:text-lg font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Priority Matrix */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Jerarquización IA</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-1.5">
                {priorityMatrix.map((item) => (
                  <div key={item.id} className={cn("rounded-lg p-1.5 text-center", levelColor[item.nivel] + "/20 border border-current/20")}>
                    <div className={cn("w-1.5 h-1.5 rounded-full mx-auto mb-0.5", levelColor[item.nivel])} />
                    <p className="text-[8px] text-slate-300 leading-tight truncate">{item.sector}</p>
                    <p className={cn("text-[7px] font-bold mt-0.5",
                      item.nivel === 0 ? "text-emerald-400" :
                      item.nivel === 1 ? "text-yellow-400"  :
                      item.nivel === 2 ? "text-orange-400"  : "text-red-400"
                    )}>Nv.{item.nivel} — {levelLabel[item.nivel]}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 justify-center flex-wrap">
                {[
                  { label: "Normal", cls: "bg-emerald-500" },
                  { label: "Bajo",   cls: "bg-yellow-400"  },
                  { label: "Medio",  cls: "bg-orange-500"  },
                  { label: "Alto",   cls: "bg-red-600"     },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex items-center gap-0.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", cls)} />
                    <span className="text-[8px] text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chatbot Stats */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Top Consultas — Nagua</span>
              </div>
              <div className="flex flex-col gap-2">
                {topChatbotTopics.map((topic) => (
                  <div key={topic.rank} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-purple-400 w-4 shrink-0">#{topic.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-300 truncate pr-1">{topic.topic}</span>
                        <span className="text-[9px] text-slate-500 shrink-0">{topic.consultas}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1">
                        <div className="h-1 rounded-full bg-purple-500" style={{ width: `${(topic.consultas / 342) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LEFT PANEL — Infrastructure: third on mobile */}
          <div className="flex flex-col gap-3 order-3 lg:order-1 lg:overflow-y-auto">

            {/* Vialidad */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Vialidad</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400">Semáforos activos</span>
                <span className="text-sm font-bold text-emerald-400">{dashboardMetrics.semaforosActivos}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
                <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${dashboardMetrics.semaforosActivos}%` }} />
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={chartData.vialidad}>
                  <Line type="monotone" dataKey="valor" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Servicios Públicos */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Servicios Públicos</span>
              </div>
              <div className="flex gap-3 justify-around">
                <div className="flex flex-col items-center gap-1">
                  <PieChart width={70} height={70}>
                    <Pie data={[{ value: 93 }, { value: 7 }]} innerRadius={22} outerRadius={32} startAngle={90} endAngle={-270} dataKey="value">
                      <Cell fill="#22d3ee" /><Cell fill="#334155" />
                    </Pie>
                  </PieChart>
                  <span className="text-[9px] text-slate-400 text-center">Agua<br /><strong className="text-cyan-400">93%</strong></span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <PieChart width={70} height={70}>
                    <Pie data={[{ value: 70 }, { value: 30 }]} innerRadius={22} outerRadius={32} startAngle={90} endAngle={-270} dataKey="value">
                      <Cell fill="#facc15" /><Cell fill="#334155" />
                    </Pie>
                  </PieChart>
                  <span className="text-[9px] text-slate-400 text-center">Potencia<br /><strong className="text-yellow-400">70%</strong></span>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Seguridad Ciudadana</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400">Incidentes en proceso</span>
                <span className="text-sm font-bold text-red-400">{dashboardMetrics.incidentesEnProceso}</span>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={chartData.incidentes}>
                  <Line type="monotone" dataKey="valor" stroke="#f87171" strokeWidth={2} dot={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
