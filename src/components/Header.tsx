"use client";

import React from "react";
import {
  Sparkles,
  Database,
  Share2,
  Plus,
  Search,
  Bell,
  Globe,
  Radio,
  LogOut,
  Shield,
  User as UserIcon,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { User } from "../types/crm";
import { getAssetPath } from "../lib/basePath";

interface HeaderProps {
  onOpenNewLead: () => void;
  onOpenUsers?: () => void;
  onOpenSocialSimulator?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  leadsCount: number;
  totalPipelineUsd: number;
  mrrTotalUsd: number;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewLead,
  onOpenUsers,
  onOpenSocialSimulator,
  searchQuery,
  setSearchQuery,
  leadsCount,
  totalPipelineUsd,
  mrrTotalUsd,
  currentUser,
  onLogout,
}) => {
  const getRoleBadge = (rol?: string) => {
    switch (rol) {
      case "ADMIN":
        return "bg-purple-950/80 text-purple-300 border-purple-500/40";
      case "COMERCIAL":
        return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      case "PROJECT_MANAGER":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand identity with official Mercury CAD logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#030212] border border-[#6382BF]/40 shadow-lg shadow-[#375EFB]/20 flex items-center justify-center p-1 group-hover:border-[#375EFB] group-hover:shadow-[#375EFB]/40 transition-all">
              <img
                src={getAssetPath("/brand/mercury-icon.png")}
                alt="Mercury Creation & Design"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(55,94,251,0.5)]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030212]" title="Sistema Activo" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 font-poppins">
                Mercury Creation & Design
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#375EFB]/20 text-[#C0C1E6] border border-[#375EFB]/40 shadow-sm">
                  CRM Local
                </span>
              </h1>
            </div>
            {currentUser?.rol === "ADMIN" ? (
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PostgreSQL 17 :5432
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-[#C0C1E6]">
                  <Radio className="w-3 h-3 animate-spin text-[#375EFB]" />
                  Omnicanal
                </span>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Plataforma de Gestión Comercial &amp; Cartera de Clientes
              </p>
            )}
          </div>
        </div>

        {/* Global Search and Metrics Quick-Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, empresa, red social o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Controls & User Profile Badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewLead}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 border border-blue-400/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Lead</span>
          </button>

          {/* Direct User Management Button (for ADMIN or anyone) */}
          {onOpenUsers && (
            <button
              onClick={onOpenUsers}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Abrir Gestión de Usuarios, Permisos RBAC y Menú Lateral"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Gestión de Usuarios</span>
            </button>
          )}

          {/* User Session Chip */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-slate-700">
                      {currentUser.nombre.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-200 leading-tight">
                    {currentUser.nombre}
                  </div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border inline-block ${getRoleBadge(
                      currentUser.rol
                    )}`}
                  >
                    {currentUser.rol}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-1.5"
                  title="Cambiar de usuario o cerrar sesión"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Cambiar Usuario</span>
                  <LogOut className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
