"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Monitor, LogOut } from "lucide-react";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";

export default function PortalSelector() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuth()) router.replace("/login");
  }, [router]);

  const choose = (role: "citizen" | "mayor") => {
    const auth = getAuth();
    if (!auth) return;
    setAuth({ ...auth, role });
    router.push(role === "citizen" ? "/citizen" : "/dashboard");
  };

  const logout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <span className="text-white text-2xl font-black">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">Bienvenido al Sistema</h1>
          <p className="text-sm text-slate-400 mt-1">Selecciona tu vista de acceso</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Citizen portal */}
          <button
            onClick={() => choose("citizen")}
            className="group flex flex-col items-center gap-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 rounded-2xl p-6 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 group-hover:bg-blue-600/40 flex items-center justify-center transition-colors">
              <Smartphone className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Vista Ciudadana</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">App móvil de reportes y consultas</p>
            </div>
            <div className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              App Móvil
            </div>
          </button>

          {/* Mayor portal */}
          <button
            onClick={() => choose("mayor")}
            className="group flex flex-col items-center gap-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-purple-500 rounded-2xl p-6 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 group-hover:bg-purple-600/40 flex items-center justify-center transition-colors">
              <Monitor className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Panel Ejecutivo</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">Dashboard de la Alcaldesa</p>
            </div>
            <div className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Dashboard
            </div>
          </button>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-xs transition-colors py-2"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
