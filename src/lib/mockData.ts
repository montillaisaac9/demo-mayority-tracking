export const mockReports = [
  { id: "NGN-4029", category: "Vialidad", detail: "Bache en Av. Universidad", status: "En Proceso", priority: "Alta", date: "2026-05-24" },
  { id: "NGN-4028", category: "Servicios Públicos", detail: "Bote de agua Urb. La Granja", status: "Resuelto", priority: "Media", date: "2026-05-23" },
  { id: "NGN-4027", category: "Aseo Público", detail: "Basura acumulada sector Don Bosco", status: "Pendiente", priority: "Baja", date: "2026-05-22" },
];

export const faqAnswers = {
  horario: "El Registro Civil de Naguanagua trabaja de lunes a viernes, de 8:00 a.m. a 4:00 p.m. Para trámites de actas de nacimiento o cartas de residencia, te sugiero llegar temprano.",
  fundanagua: "La sede operativa de Fundanagua se encuentra en la Avenida Universidad, vía el Complejo Deportivo Don Bosco. Te adjunto el mapa para que llegues directo [Ver en Mapa].",
  impuestos: "Puedes realizar tus declaraciones y pagos en línea a través del portal digital de Hacienda o asistiendo a las taquillas de atención en el C.C. Paseo La Granja, de 8:30 a.m. a 3:30 p.m.",
};

export const dashboardMetrics = {
  totalReports: 1521,
  totalAlerts: 2053,
  semaforosActivos: 85,
  aguaCobertura: 93,
  potenciaElectrica: 70,
  incidentesEnProceso: 34,
};

export const chartData = {
  vialidad: [
    { mes: "Ene", valor: 72 }, { mes: "Feb", valor: 78 }, { mes: "Mar", valor: 80 },
    { mes: "Abr", valor: 75 }, { mes: "May", valor: 85 },
  ],
  incidentes: [
    { mes: "Ene", valor: 45 }, { mes: "Feb", valor: 38 }, { mes: "Mar", valor: 52 },
    { mes: "Abr", valor: 41 }, { mes: "May", valor: 34 },
  ],
};

export const topChatbotTopics = [
  { rank: 1, topic: "Registro Civil", consultas: 342 },
  { rank: 2, topic: "Impuestos Comerciales", consultas: 218 },
  { rank: 3, topic: "Fundanagua / Ubicaciones", consultas: 174 },
  { rank: 4, topic: "Recolección de Basura", consultas: 98 },
];

export const priorityMatrix = [
  { id: 1, sector: "Av. Universidad", tipo: "Vialidad", nivel: 3, color: "red" },
  { id: 2, sector: "Urb. La Granja", tipo: "Agua", nivel: 2, color: "orange" },
  { id: 3, sector: "Don Bosco", tipo: "Aseo", nivel: 1, color: "yellow" },
  { id: 4, sector: "El Viñedo", tipo: "Alumbrado", nivel: 2, color: "orange" },
  { id: 5, sector: "Los Mangos", tipo: "Seguridad", nivel: 1, color: "yellow" },
  { id: 6, sector: "La Isabelica", tipo: "Vialidad", nivel: 3, color: "red" },
  { id: 7, sector: "Prebo", tipo: "Agua", nivel: 1, color: "yellow" },
  { id: 8, sector: "Bárbula", tipo: "Aseo", nivel: 0, color: "green" },
  { id: 9, sector: "El Trigal", tipo: "Semáforos", nivel: 0, color: "green" },
];
