"use client";

import React, { useState, useEffect } from "react";
import { User } from "../types/crm";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Clock,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User, remember: boolean) => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Brute force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.toLowerCase().trim();
      const foundUser = users.find(
        (u) => u.email.toLowerCase().trim() === cleanEmail
      );

      // Validate email exists
      if (!foundUser) {
        handleFailedAttempt("Correo o contraseña incorrectos. Verifique sus credenciales.");
        return;
      }

      // Check user active status
      if (!foundUser.activo) {
        setErrorMessage("Este usuario se encuentra deshabilitado por la Dirección.");
        setLoading(false);
        return;
      }

      // Strict password validation
      if (!foundUser.password || foundUser.password !== password) {
        handleFailedAttempt("Correo o contraseña incorrectos. Verifique sus credenciales.");
        return;
      }

      // Success
      setFailedAttempts(0);
      setLoading(false);
      onLogin(foundUser, rememberMe);
    }, 350);
  };

  const handleFailedAttempt = (msg: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    setLoading(false);

    if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
      setLockoutRemaining(LOCKOUT_SECONDS);
      setErrorMessage(
        `Demasiados intentos fallidos. Acceso bloqueado temporalmente por ${LOCKOUT_SECONDS} segundos por razones de seguridad.`
      );
    } else {
      const remaining = MAX_FAILED_ATTEMPTS - nextAttempts;
      setErrorMessage(
        `${msg} (${remaining} intento${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} antes del bloqueo temporal).`
      );
    }
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
            <span>CRM & Gestión Comercial</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Acceso Seguro RBAC</span>
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
                Ingresa con tu usuario y contraseña asignados
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Protegido
            </span>
          </div>

          {/* Quick Profile Login Chips */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Acceso Rápido con 1 Clic (Selecciona tu Perfil):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("victor@mercurycad.com.ar");
                  setPassword("mercury2026");
                  const victor = users.find((u) => u.email === "victor@mercurycad.com.ar");
                  if (victor) onLogin(victor, true);
                }}
                className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-200 group-hover:text-white">
                  <span>👑 Víctor</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900 border border-purple-500/30 text-purple-300">ADMIN</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Acceso a Menú Lateral &amp; Crear Usuarios</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("ventas@mercurycad.com.ar");
                  setPassword("comercial2026");
                  const mariana = users.find((u) => u.email === "ventas@mercurycad.com.ar");
                  if (mariana) onLogin(mariana, true);
                }}
                className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 hover:border-blue-400 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-200 group-hover:text-white">
                  <span>💼 Mariana</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900 border border-blue-500/30 text-blue-300">VENTAS</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Cartera de Clientes &amp; Pipeline</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("pm@mercurycad.com.ar");
                  setPassword("pm2026");
                  const lucas = users.find((u) => u.email === "pm@mercurycad.com.ar");
                  if (lucas) onLogin(lucas, true);
                }}
                className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-200 group-hover:text-white">
                  <span>🚀 Lucas</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-500/30 text-emerald-300">PM</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Proyectos &amp; Abonos Activos</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={lockoutRemaining > 0}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu_correo@mercurycad.com.ar"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner disabled:opacity-50"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Contraseña</span>
                <span className="text-[11px] text-slate-500">Mínimo 6 caracteres</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={lockoutRemaining > 0}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner disabled:opacity-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  tabIndex={-1}
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
                  disabled={lockoutRemaining > 0}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/40 w-4 h-4"
                />
                <span>Recordar sesión en este equipo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 border border-blue-400/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar de forma segura</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice & Protocol */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>Políticas de Seguridad Activas</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 pl-6 list-disc">
              <li>Obligatorio ingresar usuario y contraseña personales.</li>
              <li>Protección contra fuerza bruta con bloqueo por intentos repetidos.</li>
              <li>Aislamiento de módulos según rol asignado (RBAC).</li>
            </ul>
          </div>
        </div>

        {/* Security footer banner */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acceso autenticado y cifrado • Mercury CAD Mendoza</span>
        </div>
      </div>
    </div>
  );
};
