"use client";

import { useState } from "react";
import {
  ArrowLeft, Droplets, Lightbulb, ShieldAlert, Trash2,
  MapPin, Camera, ImagePlus, CheckCircle2, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import ReportMap from "@/components/maps/ReportMap";
import { addReport, generateReportId, getIncidentTypes } from "@/lib/store";

type Category = { id: string; icon: React.ElementType; label: string; sub: string; color: string; accent: string };

const BASE_CATEGORIES: Category[] = [
  { id: "agua",      icon: Droplets,    label: "Servicios Públicos",  sub: "Botes de agua, alumbrado",  color: "bg-blue-50 border-blue-200",   accent: "bg-blue-600" },
  { id: "vialidad",  icon: Lightbulb,   label: "Vialidad y Tránsito", sub: "Baches, semáforos",          color: "bg-amber-50 border-amber-200", accent: "bg-amber-500" },
  { id: "seguridad", icon: ShieldAlert, label: "Seguridad Ciudadana", sub: "Alertas, incidentes",        color: "bg-red-50 border-red-200",     accent: "bg-red-600" },
  { id: "aseo",      icon: Trash2,      label: "Aseo Público",        sub: "Recolección de basura",      color: "bg-green-50 border-green-200", accent: "bg-green-600" },
];

type Step = 1 | 2 | 3 | 4;
type Props = { initialCategory?: string; onClose: () => void };

export default function ReportForm({ initialCategory, onClose }: Props) {
  // Merge stored custom types with base categories
  const incidentTypes = typeof window !== "undefined" ? getIncidentTypes() : [];
  const categories: Category[] = BASE_CATEGORIES.map((b) => {
    const stored = incidentTypes.find((t) => t.id === b.id);
    return stored ? { ...b, label: stored.label } : b;
  });
  // Append custom types not in base list
  const customCats = incidentTypes
    .filter((t) => t.active && !BASE_CATEGORIES.find((b) => b.id === t.id))
    .map((t) => ({
      id: t.id, icon: ShieldAlert, label: t.label, sub: t.description,
      color: "bg-slate-50 border-slate-200", accent: "bg-slate-600",
    }));
  const allCategories = [...categories, ...customCats];

  const subtypesMap: Record<string, string[]> = {};
  incidentTypes.forEach((t) => { subtypesMap[t.id] = t.subtypes; });

  const [step, setStep] = useState<Step>(initialCategory ? 2 : 1);
  const [selectedCat, setSelectedCat]  = useState(initialCategory ?? "");
  const [selectedSub, setSelectedSub]  = useState("");
  const [description, setDescription]  = useState("");
  const [location, setLocation]        = useState("");
  const [coords, setCoords]            = useState<{ lat: number; lng: number } | null>(null);
  const [photoAdded, setPhotoAdded]    = useState(false);
  const [anonymous, setAnonymous]      = useState(false);
  const [ticket]                       = useState(() => generateReportId());

  const cat = allCategories.find((c) => c.id === selectedCat);
  const currentSubtypes = subtypesMap[selectedCat] ?? [];

  const canNext = () => {
    if (step === 1) return selectedCat !== "";
    if (step === 2) return selectedSub !== "" && (location !== "" || coords !== null);
    return true;
  };

  const next = () => {
    if (!canNext()) return;
    const nextStep = (step + 1) as Step;
    if (nextStep === 4) {
      // Persist to shared store when reaching confirmation
      addReport({
        id: ticket,
        category: selectedCat,
        categoryLabel: cat?.label ?? selectedCat,
        subtype: selectedSub,
        description,
        location,
        coords: coords ?? undefined,
        hasPhoto: photoAdded,
        anonymous,
        status: "Pendiente",
        priority: location.toLowerCase().includes("universidad") ? "Alta" : "Media",
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        source: "app",
      });
    }
    setStep(nextStep);
  };

  const back = () => {
    if (step === 1) { onClose(); return; }
    setStep((s) => (s - 1) as Step);
  };

  const steps = ["Categoría", "Detalle", "Evidencia", "Confirmación"];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
        <button onClick={back} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900">Nuevo Reporte</h2>
          <p className="text-[10px] text-gray-400">Paso {step} de 4 — {steps[step - 1]}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 px-4 py-2 shrink-0">
        {steps.map((_, i) => (
          <div key={i} className={cn("flex-1 h-1 rounded-full transition-all",
            i + 1 < step  ? "bg-blue-600" :
            i + 1 === step ? "bg-blue-400" :
            "bg-gray-200"
          )} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── STEP 1: Categoría ── */}
        {step === 1 && (
          <div className="p-4 flex flex-col gap-3">
            <p className="text-xs text-gray-500 font-medium">¿Qué tipo de problema quieres reportar?</p>
            {allCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  selectedCat === c.id
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : `${c.color} hover:border-gray-300`
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selectedCat === c.id ? "bg-blue-600" : "bg-white border border-gray-200")}>
                  <c.icon className={cn("w-5 h-5", selectedCat === c.id ? "text-white" : "text-gray-600")} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{c.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>
                </div>
                {selectedCat === c.id && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>}
              </button>
            ))}

            {/* Anonymous toggle */}
            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-3 mt-1">
              <div>
                <p className="text-xs font-semibold text-purple-900">Reporte Anónimo</p>
                <p className="text-[10px] text-purple-600">Tu identidad no será revelada</p>
              </div>
              <button
                onClick={() => setAnonymous(!anonymous)}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors shrink-0",
                  anonymous ? "bg-purple-600" : "bg-gray-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  anonymous ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Detalle y Ubicación ── */}
        {step === 2 && cat && (
          <div className="p-4 flex flex-col gap-4">
            {/* Category badge */}
            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border", cat.color)}>
              <cat.icon className="w-4 h-4" />
              <span className="text-xs font-semibold">{cat.label}</span>
            </div>

            {/* Subtypes */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Tipo específico *</p>
              <div className="grid grid-cols-2 gap-2">
                {currentSubtypes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSub(s)}
                    className={cn(
                      "text-[11px] font-medium px-3 py-2 rounded-lg border-2 text-left transition-all",
                      selectedSub === s
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">Descripción</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el problema con el mayor detalle posible..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 resize-none transition-colors"
              />
            </div>

            {/* Map location picker */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-xs font-semibold text-gray-700">Ubicación en el mapa *</p>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">Toca el mapa para marcar el lugar exacto</p>
              <div className="h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative">
                <ReportMap
                  onLocationSelect={(lat, lng, address) => {
                    setCoords({ lat, lng });
                    setLocation(address);
                  }}
                />
              </div>
              {location && (
                <div className="flex items-center gap-1.5 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="text-[10px] text-blue-700 font-medium">{location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Evidencia (foto) ── */}
        {step === 3 && (
          <div className="p-4 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-700">Agrega una foto como evidencia</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Opcional, pero ayuda a priorizar el reporte más rápido</p>
            </div>

            {!photoAdded ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPhotoAdded(true)}
                  className="flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-700">Tomar foto</p>
                    <p className="text-[10px] text-gray-400">Cámara del dispositivo</p>
                  </div>
                </button>

                <button
                  onClick={() => setPhotoAdded(true)}
                  className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                >
                  <ImagePlus className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Subir desde galería</span>
                </button>

                <button onClick={next} className="text-xs text-gray-400 text-center py-2 hover:text-gray-600 transition-colors">
                  Omitir este paso →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Simulated photo preview */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200 border border-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-slate-500 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">Foto adjunta</p>
                    </div>
                  </div>
                  {/* Blur badge — LOPNNA compliance */}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    IA: Rostros protegidos (LOPNNA)
                  </div>
                  <button
                    onClick={() => setPhotoAdded(false)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-center text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5">
                  La IA aplicó automáticamente protección de privacidad (LOPNNA)
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Confirmación ── */}
        {step === 4 && (
          <div className="p-4 flex flex-col items-center gap-4">
            {/* Success icon */}
            <div className="pt-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">¡Reporte enviado!</h3>
              <p className="text-xs text-gray-500 mt-1">Tu reporte ha sido recibido y clasificado por nuestra IA</p>
            </div>

            {/* Ticket */}
            <div className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wider mb-1">Número de Ticket</p>
              <p className="text-2xl font-black text-blue-700">{ticket}</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Prioridad Alta — IA clasificó la zona crítica
              </div>
            </div>

            {/* Summary */}
            <div className="w-full bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                { label: "Categoría",   value: cat?.label ?? "—" },
                { label: "Tipo",        value: selectedSub || "—" },
                { label: "Ubicación",   value: location || "—" },
                { label: "Evidencia",   value: photoAdded ? "Foto adjunta ✓" : "Sin foto" },
                { label: "Anónimo",     value: anonymous ? "Sí" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2">
                  <span className="text-[10px] text-gray-400">{label}</span>
                  <span className="text-[10px] font-semibold text-gray-700 text-right max-w-[55%] truncate">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA (steps 1–3) */}
      {step < 4 && (
        <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={next}
            disabled={!canNext()}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              canNext()
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {step === 3 ? "Enviar reporte" : "Continuar"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
