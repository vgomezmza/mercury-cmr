"use client";

import React, { useState } from "react";
import { User } from "../types/crm";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  UserCheck,
  Briefcase,
  Layers,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User, remember: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState("victor@mercurycad.com.ar");
  const [password, setPassword] = useState("mercury2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const foundUser = users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (!foundUser) {
        setErrorMessage("No existe ningún usuario registrado con este correo.");
        setLoading(false);
        return;
      }

      if (!foundUser.activo) {
        setErrorMessage("Este usuario se encuentra deshabilitado por el Administrador.");
        setLoading(false);
        return;
      }

      // Check password (simple comparison for local CRM or demo)
      if (foundUser.password && foundUser.password !== password) {
        setErrorMessage("Contraseña incorrecta. Verifique sus datos.");
        setLoading(false);
        return;
      }

      // Success
      setLoading(false);
      onLogin(foundUser, rememberMe);
    }, 300);
  };

  const handleQuickLogin = (quickUser: User) => {
    setEmail(quickUser.email);
    setPassword(quickUser.password || "mercury2026");
    setErrorMessage(null);
    onLogin(quickUser, true);
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-xl shadow-blue-500/30 ring-1 ring-white/20 mb-4 animate-in zoom-in-95 duration-500">
            <span className="font-black text-white text-2xl tracking-wider">M</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Mercury Creation & Design
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-2">
            <span>CRM & Gestión Omnicanal</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">PostgreSQL 17</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingrese sus credenciales de acceso local
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              v2.4 Pro
            </span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@mercurycad.com.ar"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Contraseña</span>
                <span className="text-[11px] text-slate-500">Mínimo 6 caracteres</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/40 w-4 h-4"
                />
                <span>Recordar sesión en esta PC</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 border border-blue-400/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access (1-click profiles) */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Acceso Rápido por Perfil (Demo Local)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {users.map((u) => {
                const isDirector = u.rol === "ADMIN";
                const isComercial = u.rol === "COMERCIAL";
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="w-full p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                            {u.nombre.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {u.nombre}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {u.cargo || u.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDirector
                          ? "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                          : isComercial
                          ? "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {u.rol}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security footer banner */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acceso cifrado y restringido a la red de Mercury CAD Mendoza</span>
        </div>
      </div>
    </div>
  );
};
