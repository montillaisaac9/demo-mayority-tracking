"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getIncidentTypes, addIncidentType, updateIncidentType, deleteIncidentType,
  type IncidentType,
} from "@/lib/store";
import { cn } from "@/lib/cn";

const COLOR_OPTIONS = [
  "#2563eb", "#d97706", "#dc2626", "#16a34a",
  "#7c3aed", "#0891b2", "#db2777", "#65a30d",
];

function newType(): IncidentType {
  return { id: "", label: "", description: "", color: "#2563eb", active: true, subtypes: [] };
}

export default function MastersPanel() {
  const [types, setTypes]         = useState<IncidentType[]>([]);
  const [editing, setEditing]     = useState<IncidentType | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [subtypeInput, setSubtypeInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(() => setTypes(getIncidentTypes()), []);
  useEffect(() => {
    load();
    const onUpdate = () => load();
    window.addEventListener("store-update", onUpdate);
    return () => window.removeEventListener("store-update", onUpdate);
  }, [load]);

  const openNew = () => {
    setEditing(newType());
    setIsNew(true);
    setSubtypeInput("");
  };

  const openEdit = (t: IncidentType) => {
    setEditing({ ...t });
    setIsNew(false);
    setSubtypeInput("");
  };

  const save = () => {
    if (!editing || !editing.label.trim()) return;
    if (isNew) {
      const id = editing.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + "_" + Date.now();
      addIncidentType({ ...editing, id });
    } else {
      updateIncidentType(editing.id, editing);
    }
    setEditing(null);
    load();
  };

  const addSubtype = () => {
    if (!subtypeInput.trim() || !editing) return;
    setEditing({ ...editing, subtypes: [...editing.subtypes, subtypeInput.trim()] });
    setSubtypeInput("");
  };

  const removeSubtype = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, subtypes: editing.subtypes.filter((_, idx) => idx !== i) });
  };

  const toggleActive = (id: string, active: boolean) => {
    updateIncidentType(id, { active: !active });
    load();
  };

  const doDelete = (id: string) => {
    deleteIncidentType(id);
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white">Tipos de Incidencias</h2>
          <p className="text-xs text-slate-400">Configura las categorías disponibles en la app ciudadana</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nuevo tipo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {types.map((t) => (
            <div
              key={t.id}
              className={cn(
                "bg-slate-800 border rounded-xl p-4 transition-all",
                t.active ? "border-slate-700" : "border-slate-800 opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Color swatch */}
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow"
                  style={{ background: t.color }}>
                  <span className="text-white text-sm font-black">{t.label.charAt(0)}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{t.label}</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                      t.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"
                    )}>
                      {t.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                  {t.subtypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {t.subtypes.map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(t.id, t.active)}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title={t.active ? "Desactivar" : "Activar"}
                  >
                    {t.active
                      ? <ToggleRight className="w-4 h-4 text-emerald-400" />
                      : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(t.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / New modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-white">{isNew ? "Nuevo tipo de incidencia" : "Editar tipo"}</h3>
              <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Label */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nombre *</label>
                <input
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  placeholder="Ej. Infraestructura Educativa"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Descripción breve"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Color de categoría</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditing({ ...editing, color: c })}
                      className={cn("w-8 h-8 rounded-lg transition-all", editing.color === c && "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110")}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2.5">
                <span className="text-xs text-slate-300">Visible en la app</span>
                <button
                  onClick={() => setEditing({ ...editing, active: !editing.active })}
                  className={cn("w-10 h-5 rounded-full relative transition-colors", editing.active ? "bg-emerald-500" : "bg-slate-600")}
                >
                  <span className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", editing.active ? "translate-x-5" : "translate-x-0.5")} />
                </button>
              </div>

              {/* Subtypes */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Subtipos</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={subtypeInput}
                    onChange={(e) => setSubtypeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtype()}
                    placeholder="Agregar subtipo…"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={addSubtype}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editing.subtypes.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                      {s}
                      <button onClick={() => removeSubtype(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {editing.subtypes.length === 0 && (
                    <span className="text-xs text-slate-600">Sin subtipos aún</span>
                  )}
                </div>
              </div>

              {/* Save */}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white text-xs transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={save}
                  disabled={!editing.label.trim()}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors",
                    editing.label.trim()
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Check className="w-3.5 h-3.5" /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-red-500/30 rounded-2xl p-6 mx-4 max-w-xs w-full shadow-2xl text-center">
            <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">¿Eliminar este tipo?</p>
            <p className="text-xs text-slate-400 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 text-xs hover:text-white transition-colors">
                Cancelar
              </button>
              <button onClick={() => doDelete(confirmDelete!)}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
