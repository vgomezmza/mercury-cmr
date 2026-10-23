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
} from "lucide-react";
import { User } from "../types/crm";

interface HeaderProps {
  onOpenNewLead: () => void;
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
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <span className="font-extrabold text-white text-lg tracking-wider">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                Mercury Creation & Design
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CRM Local
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PostgreSQL 17 :5432
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Radio className="w-3 h-3 animate-spin" />
                Omnicanal (Meta, IG, LinkedIn, X)
              </span>
            </p>
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
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
