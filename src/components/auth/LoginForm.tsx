"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { setAuth, DEMO_CREDENTIALS } from "@/lib/auth";
import { cn } from "@/lib/cn";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        setAuth({ email: email.trim().toLowerCase(), role: null });
        router.push("/portal");
      } else {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        setLoading(false);
      }
    }, 800);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <span className="text-white text-2xl font-black">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">Plataforma Municipal</h1>
          <p className="text-sm text-slate-400 mt-1">Alcaldía de Naguanagua</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-5">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                loading
                  ? "bg-blue-700/50 text-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
              )}
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 pt-5 border-t border-slate-700">
            <p className="text-[11px] text-slate-500 text-center mb-2">Credenciales de demostración</p>
            <button
              onClick={fillDemo}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl py-2 px-3 text-xs text-slate-300 transition-colors font-mono"
            >
              alcadia@gmail.com · 12345678
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6">
          Sistema IA Municipal · Versión Demo · 2026
        </p>
      </div>
    </div>
  );
}
