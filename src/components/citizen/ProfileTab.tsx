"use client";

import { useRouter } from "next/navigation";
import { User, MapPin, Phone, Mail, ChevronRight, LogOut } from "lucide-react";
import { clearAuth } from "@/lib/auth";

const menuItems = [
  { icon: User, label: "Datos Personales", sub: "Nombre, cédula, dirección" },
  { icon: MapPin, label: "Mi Ubicación", sub: "Sector registrado" },
  { icon: Phone, label: "Contacto de Emergencia", sub: "Número registrado" },
  { icon: Mail, label: "Notificaciones", sub: "Configurar alertas" },
];

export default function ProfileTab() {
  const router = useRouter();

  const logout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="pt-2">
        <h2 className="text-base font-bold text-gray-900">Perfil</h2>
      </div>

      <div className="flex flex-col items-center gap-3 py-4 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100">
        <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900">Ciudadano</p>
          <p className="text-xs text-gray-500">Naguanagua, Carabobo</p>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-base font-bold text-blue-700">3</p>
            <p className="text-[10px] text-gray-500">Reportes</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-base font-bold text-green-600">1</p>
            <p className="text-[10px] text-gray-500">Resueltos</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-base font-bold text-amber-600">2</p>
            <p className="text-[10px] text-gray-500">En proceso</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <button key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">{item.label}</p>
              <p className="text-[10px] text-gray-400">{item.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Cerrar Sesión
      </button>
    </div>
  );
}
