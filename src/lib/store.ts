export type ReportStatus = "Pendiente" | "En Validación" | "Validado" | "Resuelto" | "Rechazado";
export type ReportPriority = "Alta" | "Media" | "Baja";

export type Report = {
  id: string;
  category: string;
  categoryLabel: string;
  subtype: string;
  description: string;
  location: string;
  coords?: { lat: number; lng: number };
  hasPhoto: boolean;
  anonymous: boolean;
  status: ReportStatus;
  priority: ReportPriority;
  date: string;
  createdAt: string;
  source: "app" | "admin";
};

export type IncidentType = {
  id: string;
  label: string;
  description: string;
  color: string;
  active: boolean;
  subtypes: string[];
};

const REPORTS_KEY = "naguanagua_reports";
const TYPES_KEY   = "naguanagua_types";
const STORE_VERSION_KEY = "naguanagua_store_v";
const STORE_VERSION = "2"; // bump when INITIAL_* data changes

const INITIAL_REPORTS: Report[] = [
  {
    id: "NGN-4029", category: "vialidad", categoryLabel: "Vialidad y Tránsito",
    subtype: "Bache / Hueco", description: "Gran bache frente a la entrada de la UC",
    location: "Av. Universidad, cerca de la UC",
    coords: { lat: 10.2012, lng: -67.9965 },
    hasPhoto: false, anonymous: false, status: "En Validación", priority: "Alta",
    date: "2026-05-24", createdAt: "2026-05-24T09:15:00Z", source: "app",
  },
  {
    id: "NGN-4028", category: "agua", categoryLabel: "Servicios Públicos",
    subtype: "Bote de agua en la calle", description: "Tubería rota en la acera",
    location: "Urb. La Granja, Naguanagua",
    coords: { lat: 10.1988, lng: -67.9922 },
    hasPhoto: true, anonymous: false, status: "Resuelto", priority: "Media",
    date: "2026-05-23", createdAt: "2026-05-23T14:30:00Z", source: "app",
  },
  {
    id: "NGN-4027", category: "aseo", categoryLabel: "Aseo Público",
    subtype: "Basura acumulada", description: "Punto crítico de basura sin recoger 3 días",
    location: "Sector Don Bosco, Naguanagua",
    coords: { lat: 10.2048, lng: -67.9998 },
    hasPhoto: false, anonymous: true, status: "Pendiente", priority: "Baja",
    date: "2026-05-22", createdAt: "2026-05-22T08:00:00Z", source: "app",
  },
  {
    id: "NGN-4026", category: "seguridad", categoryLabel: "Seguridad Ciudadana",
    subtype: "Iluminación insegura", description: "Calle completamente oscura de noche, varias semanas",
    location: "El Viñedo, Naguanagua",
    coords: { lat: 10.1962, lng: -67.9948 },
    hasPhoto: true, anonymous: false, status: "Validado", priority: "Alta",
    date: "2026-05-21", createdAt: "2026-05-21T20:00:00Z", source: "app",
  },
];

const INITIAL_TYPES: IncidentType[] = [
  {
    id: "agua", label: "Servicios Públicos", description: "Agua potable y alumbrado",
    color: "#2563eb", active: true,
    subtypes: ["Bote de agua en la calle", "Tubería rota", "Falta de suministro", "Agua contaminada"],
  },
  {
    id: "vialidad", label: "Vialidad y Tránsito", description: "Baches, semáforos y señales",
    color: "#d97706", active: true,
    subtypes: ["Bache / Hueco", "Semáforo dañado", "Señal de tráfico caída", "Derrumbe en vía"],
  },
  {
    id: "seguridad", label: "Seguridad Ciudadana", description: "Alertas e incidentes de seguridad",
    color: "#dc2626", active: true,
    subtypes: ["Situación de riesgo", "Alerta vecinal", "Iluminación insegura", "Otro"],
  },
  {
    id: "aseo", label: "Aseo Público", description: "Recolección y disposición de residuos",
    color: "#16a34a", active: true,
    subtypes: ["Basura acumulada", "Contenedor dañado", "Escombros en vía", "Punto crítico de desechos"],
  },
];

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("store-update", { detail: { key } }));
}

// Wipe and reseed if the stored data version is outdated
function ensureFreshSeed() {
  if (typeof window === "undefined") return;
  const storedVersion = localStorage.getItem(STORE_VERSION_KEY);
  if (storedVersion !== STORE_VERSION) {
    localStorage.removeItem(REPORTS_KEY);
    localStorage.removeItem(TYPES_KEY);
    localStorage.setItem(STORE_VERSION_KEY, STORE_VERSION);
  }
}

// ── Reports ──────────────────────────────────────────────

export function getReports(): Report[] {
  ensureFreshSeed();
  const stored = safeRead<Report[]>(REPORTS_KEY, []);
  if (stored.length === 0) {
    safeWrite(REPORTS_KEY, INITIAL_REPORTS);
    return INITIAL_REPORTS;
  }
  return stored;
}

export function addReport(report: Report): void {
  const reports = getReports();
  safeWrite(REPORTS_KEY, [report, ...reports]);
}

export function updateReportStatus(id: string, status: ReportStatus): void {
  const reports = getReports().map((r) => (r.id === id ? { ...r, status } : r));
  safeWrite(REPORTS_KEY, reports);
}

export function deleteReport(id: string): void {
  safeWrite(REPORTS_KEY, getReports().filter((r) => r.id !== id));
}

// ── Incident Types ────────────────────────────────────────

export function getIncidentTypes(): IncidentType[] {
  const stored = safeRead<IncidentType[]>(TYPES_KEY, []);
  if (stored.length === 0) {
    safeWrite(TYPES_KEY, INITIAL_TYPES);
    return INITIAL_TYPES;
  }
  return stored;
}

export function addIncidentType(type: IncidentType): void {
  safeWrite(TYPES_KEY, [...getIncidentTypes(), type]);
}

export function updateIncidentType(id: string, updates: Partial<IncidentType>): void {
  const types = getIncidentTypes().map((t) => (t.id === id ? { ...t, ...updates } : t));
  safeWrite(TYPES_KEY, types);
}

export function deleteIncidentType(id: string): void {
  safeWrite(TYPES_KEY, getIncidentTypes().filter((t) => t.id !== id));
}

// ── Helpers ───────────────────────────────────────────────

export function generateReportId(): string {
  const reports = getReports();
  const maxNum = reports.reduce((max, r) => {
    const n = parseInt(r.id.replace("NGN-", ""), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 4000);
  return `NGN-${maxNum + 1}`;
}

export function exportReportsCSV(reports: Report[]): void {
  const headers = ["ID", "Categoría", "Tipo", "Descripción", "Ubicación", "Estado", "Prioridad", "Anónimo", "Fuente", "Fecha"];
  const rows = reports.map((r) => [
    r.id, r.categoryLabel, r.subtype,
    `"${r.description.replace(/"/g, "'")}"`,
    `"${r.location}"`,
    r.status, r.priority,
    r.anonymous ? "Sí" : "No",
    r.source === "app" ? "App Ciudadana" : "Admin",
    r.date,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reportes-naguanagua-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
