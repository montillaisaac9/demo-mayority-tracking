"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Download, RefreshCw, Eye, ChevronDown,
  CheckCircle, Clock, XCircle, AlertCircle, Filter, X,
} from "lucide-react";
import {
  getReports, updateReportStatus, exportReportsCSV,
  type Report, type ReportStatus,
} from "@/lib/store";
import { cn } from "@/lib/cn";

const STATUSES: ReportStatus[] = ["Pendiente", "En Validación", "Validado", "Resuelto", "Rechazado"];

const statusStyle: Record<ReportStatus, { bg: string; text: string; icon: React.ElementType }> = {
  "Pendiente":     { bg: "bg-yellow-500/20",  text: "text-yellow-300",  icon: Clock        },
  "En Validación": { bg: "bg-blue-500/20",    text: "text-blue-300",    icon: AlertCircle  },
  "Validado":      { bg: "bg-purple-500/20",  text: "text-purple-300",  icon: CheckCircle  },
  "Resuelto":      { bg: "bg-emerald-500/20", text: "text-emerald-300", icon: CheckCircle  },
  "Rechazado":     { bg: "bg-red-500/20",     text: "text-red-300",     icon: XCircle      },
};

const priorityStyle: Record<string, string> = {
  Alta:  "text-red-400 bg-red-500/10",
  Media: "text-amber-400 bg-amber-500/10",
  Baja:  "text-emerald-400 bg-emerald-500/10",
};

export default function ReportsPanel() {
  const [reports, setReports]           = useState<Report[]>([]);
  const [search, setSearch]             = useState("");
  const [filterCat, setFilterCat]       = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [detail, setDetail]             = useState<Report | null>(null);
  const [statusMenu, setStatusMenu]     = useState<string | null>(null);
  const [showFilters, setShowFilters]   = useState(false);

  const load = useCallback(() => setReports(getReports()), []);

  useEffect(() => {
    load();
    const onUpdate = () => load();
    window.addEventListener("store-update", onUpdate);
    return () => window.removeEventListener("store-update", onUpdate);
  }, [load]);

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.id.toLowerCase().includes(q)
      || r.categoryLabel.toLowerCase().includes(q)
      || r.subtype.toLowerCase().includes(q)
      || r.location.toLowerCase().includes(q)
      || r.description.toLowerCase().includes(q);
    return matchSearch
      && (!filterCat      || r.category === filterCat)
      && (!filterStatus   || r.status === filterStatus)
      && (!filterPriority || r.priority === filterPriority);
  });

  const categories = [...new Set(reports.map((r) => r.category))];

  const changeStatus = (id: string, status: ReportStatus) => {
    updateReportStatus(id, status);
    load();
    setStatusMenu(null);
  };

  const clearFilters = () => {
    setSearch(""); setFilterCat(""); setFilterStatus(""); setFilterPriority("");
  };

  const hasFilters = search || filterCat || filterStatus || filterPriority;

  return (
    <div className="flex flex-col h-full gap-3 p-3 sm:p-4 overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-col gap-2 shrink-0">
        {/* Search row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID, categoría, ubicación…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "sm:hidden flex items-center gap-1 px-2.5 py-2 rounded-lg border text-xs transition-colors shrink-0",
              showFilters || hasFilters
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-400"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={load} className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => exportReportsCSV(filtered)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filters row — always visible on sm+, toggled on mobile */}
        <div className={cn(
          "flex gap-2 flex-wrap",
          showFilters ? "flex" : "hidden sm:flex"
        )}>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500">
            <option value="">Categoría</option>
            {categories.map((c) => (
              <option key={c} value={c}>{reports.find((r) => r.category === c)?.categoryLabel ?? c}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500">
            <option value="">Estado</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500">
            <option value="">Prioridad</option>
            {["Alta", "Media", "Baja"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors">
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap shrink-0">
        <span className="text-xs text-slate-400">{filtered.length} reporte{filtered.length !== 1 ? "s" : ""}</span>
        {(["Pendiente", "En Validación", "Validado", "Resuelto", "Rechazado"] as ReportStatus[]).map((s) => {
          const count = filtered.filter((r) => r.status === s).length;
          if (!count) return null;
          const st = statusStyle[s];
          return (
            <span key={s} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", st.bg, st.text)}>
              {s}: {count}
            </span>
          );
        })}
      </div>

      {/* MOBILE: Card list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 sm:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Filter className="w-6 h-6 mb-2 opacity-40" />
            <p className="text-xs">No hay reportes con esos filtros</p>
          </div>
        ) : filtered.map((r) => {
          const st = statusStyle[r.status];
          return (
            <div key={r.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <span className="font-mono text-blue-400 font-bold text-sm">{r.id}</span>
                  <p className="text-[11px] text-slate-400 truncate">{r.categoryLabel} · {r.subtype}</p>
                </div>
                <button onClick={() => setDetail(r)} className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Location */}
              <p className="text-[11px] text-slate-500 mb-2 truncate">{r.location}</p>
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status selector */}
                <div className="relative">
                  <button
                    onClick={() => setStatusMenu(statusMenu === r.id ? null : r.id)}
                    className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold", st.bg, st.text)}
                  >
                    <st.icon className="w-3 h-3" />
                    {r.status}
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                  {statusMenu === r.id && (
                    <div className="absolute z-50 top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl overflow-hidden min-w-max">
                      {STATUSES.map((s) => {
                        const ss = statusStyle[s];
                        return (
                          <button key={s} onClick={() => changeStatus(r.id, s)}
                            className={cn("flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-slate-700 transition-colors text-left",
                              r.status === s ? `${ss.text} font-bold` : "text-slate-300"
                            )}>
                            <ss.icon className="w-3 h-3" /> {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", priorityStyle[r.priority])}>
                  {r.priority}
                </span>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                  r.source === "app" ? "bg-blue-500/10 text-blue-400" : "bg-slate-700 text-slate-400"
                )}>
                  {r.source === "app" ? "App" : "Admin"}
                </span>
                <span className="text-[10px] text-slate-600 ml-auto">{r.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP: Table */}
      <div className="hidden sm:flex flex-1 overflow-auto rounded-xl border border-slate-700">
        <table className="w-full text-xs">
          <thead className="bg-slate-800 sticky top-0">
            <tr>
              {["ID", "Categoría", "Tipo", "Ubicación", "Estado", "Prioridad", "Fuente", "Fecha", ""].map((h) => (
                <th key={h} className="text-left px-3 py-2.5 text-slate-400 font-semibold whitespace-nowrap border-b border-slate-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-500">
                  <Filter className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  No hay reportes con esos filtros
                </td>
              </tr>
            ) : filtered.map((r) => {
              const st = statusStyle[r.status];
              return (
                <tr key={r.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-blue-400 font-semibold whitespace-nowrap">{r.id}</td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{r.categoryLabel}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.subtype}</td>
                  <td className="px-3 py-2.5 text-slate-400 max-w-[160px] truncate">{r.location}</td>
                  <td className="px-3 py-2.5">
                    <div className="relative">
                      <button
                        onClick={() => setStatusMenu(statusMenu === r.id ? null : r.id)}
                        className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap", st.bg, st.text)}
                      >
                        <st.icon className="w-3 h-3" />
                        {r.status}
                        <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                      {statusMenu === r.id && (
                        <div className="absolute z-50 top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl overflow-hidden min-w-max">
                          {STATUSES.map((s) => {
                            const ss = statusStyle[s];
                            return (
                              <button key={s} onClick={() => changeStatus(r.id, s)}
                                className={cn("flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-slate-700 transition-colors text-left",
                                  r.status === s ? `${ss.text} font-bold` : "text-slate-300"
                                )}>
                                <ss.icon className="w-3 h-3" /> {s}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", priorityStyle[r.priority])}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                      r.source === "app" ? "bg-blue-500/10 text-blue-400" : "bg-slate-700 text-slate-400"
                    )}>
                      {r.source === "app" ? "App" : "Admin"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setDetail(r)}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div
            className="bg-slate-800 border border-slate-600 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-5 sm:p-6 sm:mx-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-blue-400 font-bold text-lg">{detail.id}</span>
                <p className="text-xs text-slate-400 mt-0.5">{detail.categoryLabel} · {detail.subtype}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { label: "Estado",      value: detail.status },
                { label: "Prioridad",   value: detail.priority },
                { label: "Ubicación",   value: detail.location },
                { label: "Descripción", value: detail.description || "Sin descripción" },
                { label: "Foto",        value: detail.hasPhoto ? "Adjunta" : "Sin foto" },
                { label: "Anónimo",     value: detail.anonymous ? "Sí" : "No" },
                { label: "Fuente",      value: detail.source === "app" ? "App Ciudadana" : "Admin" },
                { label: "Creado",      value: new Date(detail.createdAt).toLocaleString("es-VE") },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 text-xs">
                  <span className="text-slate-500 w-24 shrink-0">{label}:</span>
                  <span className="text-slate-200">{value}</span>
                </div>
              ))}
            </div>
            {detail.coords && (
              <p className="text-[10px] text-slate-500 mb-4">
                Coords: {detail.coords.lat.toFixed(5)}, {detail.coords.lng.toFixed(5)}
              </p>
            )}
            <div className="flex gap-2">
              <select
                defaultValue={detail.status}
                onChange={(e) => {
                  changeStatus(detail.id, e.target.value as ReportStatus);
                  setDetail({ ...detail, status: e.target.value as ReportStatus });
                }}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                onClick={() => exportReportsCSV([detail])}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
