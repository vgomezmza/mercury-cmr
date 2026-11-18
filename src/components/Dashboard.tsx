"use client";

import React, { useMemo, useState } from "react";
import type { Lead, LeadStatus, User } from "../types/crm";
import { ArrowRight, ChevronDown, Plus, Search, X } from "lucide-react";

interface DashboardProps {
  currentUser: User;
  users: User[];
  leads: Lead[];
  onOpenNewLead: () => void;
  onSelectLead: (lead: Lead) => void;
  onNavigateTab: (tabId: string) => void;
  onAssignLead?: (leadId: string, assignedUserId: string, assignedUserName: string) => void;
  adminFilterUserId?: string;
  setAdminFilterUserId?: (userId: string) => void;
  searchQuery?: string;
}

const STATUS_BADGE_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  EN_NEGOCIACION: {
    label: "En Negociación",
    className: "bg-[#7C3A21] text-[#FCE7D9] border-[#B4532A]",
  },
  PROPUESTA_ENVIADA: {
    label: "Propuesta Enviada",
    className: "bg-[#1D3A8A] text-[#DBEAFE] border-[#3B62F6]",
  },
  NUEVO: {
    label: "Nuevo",
    className: "bg-[#14532D] text-[#DCFCE7] border-[#228B4E]",
  },
  RELEVAMIENTO: {
    label: "Relevamiento",
    className: "bg-[#164E63] text-[#CFFAFE] border-[#0891B2]",
  },
  GANADO: {
    label: "Ganado",
    className: "bg-[#065F46] text-[#D1FAE5] border-[#10B981]",
  },
  PERDIDO: {
    label: "Perdido",
    className: "bg-[#451A1A] text-[#FECACA] border-[#991B1B]",
  },
};

function formatCompactUsd(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = Number.isInteger(millions)
      ? millions.toString()
      : millions.toFixed(1).replace(/\.0$/, "");
    return `$${formatted}M USD`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    const formatted =
      thousands >= 100 || Number.isInteger(thousands)
        ? Math.round(thousands).toString()
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `$${formatted}K USD`;
  }
  return `$${amount.toLocaleString("es-AR")} USD`;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  users,
  leads,
  onOpenNewLead,
  onSelectLead,
  onNavigateTab,
  adminFilterUserId = "ALL",
  setAdminFilterUserId,
  searchQuery = "",
}) => {
  const isAdmin = currentUser.rol === "ADMIN";
  const [isListSearchOpen, setIsListSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  // Filter leads according to role and admin portfolio selector
  const userLeads = useMemo(() => {
    if (!isAdmin) {
      return leads.filter(
        (l) => l.asignadoAId === currentUser.id || l.creadoPorId === currentUser.id
      );
    }

    if (adminFilterUserId === "ALL") {
      return leads;
    }
    if (adminFilterUserId === "UNASSIGNED") {
      return leads.filter((l) => !l.asignadoAId);
    }
    return leads.filter((l) => l.asignadoAId === adminFilterUserId);
  }, [leads, currentUser, isAdmin, adminFilterUserId]);

  // KPIs
  const totalClients = userLeads.length;

  const potentialLeads = useMemo(() => {
    return userLeads.filter(
      (l) => l.estado === "NUEVO" || l.estado === "RELEVAMIENTO"
    );
  }, [userLeads]);

  const negotiationLeads = useMemo(() => {
    return userLeads.filter(
      (l) => l.estado === "PROPUESTA_ENVIADA" || l.estado === "EN_NEGOCIACION"
    );
  }, [userLeads]);

  const totalPipelineUsd = useMemo(() => {
    return userLeads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
  }, [userLeads]);

  // Priority Clients sorted by urgency and filtered by active search
  const priorityClients = useMemo(() => {
    const combinedQuery = (localSearch || searchQuery).trim().toLowerCase();

    const filtered = combinedQuery
      ? userLeads.filter(
          (l) =>
            l.empresa.toLowerCase().includes(combinedQuery) ||
            l.nombre.toLowerCase().includes(combinedQuery) ||
            (l.asignadoANombre || "").toLowerCase().includes(combinedQuery) ||
            l.estado.toLowerCase().replace("_", " ").includes(combinedQuery)
        )
      : userLeads;

    return [...filtered]
      .sort((a, b) => {
        const weight = (l: Lead) => {
          let score = 0;
          if (l.estado === "EN_NEGOCIACION") score += 50;
          if (l.estado === "PROPUESTA_ENVIADA") score += 40;
          if (l.estado === "NUEVO") score += 30;
          if (l.estado === "RELEVAMIENTO") score += 20;
          if (l.prioridad === "Alta") score += 15;
          if (l.tiempoSinContactoHoras && l.tiempoSinContactoHoras > 24) score += 10;
          return score;
        };
        return weight(b) - weight(a);
      })
      .slice(0, 25);
  }, [userLeads, localSearch, searchQuery]);

  const firstName = currentUser.nombre.split(" ")[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner (PDF Page 1) */}
      <div className="rounded-2xl bg-[#06113D] border border-[#2F4FE0] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-poppins">
            ¡Hola, {firstName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">
            {isAdmin
              ? "Vista global y supervisión comercial"
              : "Gestión personal de tu cartera comercial"}
          </p>
        </div>

        {/* Portfolio Selector */}
        {isAdmin && setAdminFilterUserId ? (
          <div className="relative inline-flex items-center gap-1.5 text-sm text-white self-start sm:self-auto">
            <span className="text-[#CBD5E1] font-normal">Cartera:</span>
            <div className="relative inline-flex items-center">
              <select
                aria-label="Seleccionar cartera"
                value={adminFilterUserId}
                onChange={(e) => setAdminFilterUserId(e.target.value)}
                className="appearance-none bg-transparent text-white font-medium pr-6 py-1 outline-none cursor-pointer text-sm"
              >
                <option value="ALL" className="bg-[#06113D] text-white">
                  Toda la Agencia ({leads.length})
                </option>
                {users
                  .filter((u) => u.rol !== "ADMIN")
                  .map((u) => {
                    const count = leads.filter((l) => l.asignadoAId === u.id).length;
                    return (
                      <option key={u.id} value={u.id} className="bg-[#06113D] text-white">
                        {u.nombre} ({count})
                      </option>
                    );
                  })}
                <option value="UNASSIGNED" className="bg-[#06113D] text-amber-300">
                  Sin Asignar ({leads.filter((l) => !l.asignadoAId).length})
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-white pointer-events-none absolute right-0" />
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#CBD5E1] self-start sm:self-auto">
            Cartera: <span className="text-white font-medium">Mis Clientes ({totalClients})</span>
          </div>
        )}
      </div>

      {/* 4 Semantic-Border KPI Cards (PDF Page 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Prospectos */}
        <button
          type="button"
          onClick={() => onNavigateTab("prospects")}
          className="text-left rounded-2xl bg-[#06113D] hover:bg-[#0A1954] border border-[#355CFF] p-6 transition-all cursor-pointer flex flex-col justify-between min-h-[168px] group"
        >
          <div className="text-sm sm:text-base font-semibold text-white leading-snug">
            {isAdmin ? (
              <>
                Total Prospectos
                <span className="block">(O Cartera Total)</span>
              </>
            ) : (
              <>
                Mis Clientes
                <span className="block">(Cartera Total)</span>
              </>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight my-3">
            {totalClients.toLocaleString("es-AR")}
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1] group-hover:text-white transition-colors">
            Contactos En Base De Datos
          </p>
        </button>

        {/* Card 2: Leads En Calificación */}
        <button
          type="button"
          onClick={() => onNavigateTab("pipeline")}
          className="text-left rounded-2xl bg-[#06113D] hover:bg-[#0A1954] border border-[#38B86B] p-6 transition-all cursor-pointer flex flex-col justify-between min-h-[168px] group"
        >
          <div className="text-sm sm:text-base font-semibold text-white leading-snug">
            Leads En Calificación
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight my-3">
            {potentialLeads.length.toLocaleString("es-AR")}
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1] group-hover:text-white transition-colors">
            Nuevos En Relevamiento
          </p>
        </button>

        {/* Card 3: En Negociación */}
        <button
          type="button"
          onClick={() => onNavigateTab("pipeline")}
          className="text-left rounded-2xl bg-[#06113D] hover:bg-[#0A1954] border border-[#C9A23F] p-6 transition-all cursor-pointer flex flex-col justify-between min-h-[168px] group"
        >
          <div className="text-sm sm:text-base font-semibold text-white leading-snug">
            En Negociación
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight my-3">
            {negotiationLeads.length.toLocaleString("es-AR")}
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1] group-hover:text-white transition-colors">
            Propuestas Presentadas
          </p>
        </button>

        {/* Card 4: Pipeline Estimado */}
        <button
          type="button"
          onClick={() => onNavigateTab("pipeline")}
          title={`Valor exacto en pipeline: $${totalPipelineUsd.toLocaleString("es-AR")} USD`}
          className="text-left rounded-2xl bg-[#06113D] hover:bg-[#0A1954] border border-[#3DB59E] p-6 transition-all cursor-pointer flex flex-col justify-between min-h-[168px] group"
        >
          <div className="text-sm sm:text-base font-semibold text-white leading-snug">
            Pipeline Estimado
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight my-3">
            {formatCompactUsd(totalPipelineUsd)}
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1] group-hover:text-white transition-colors flex items-center gap-1.5">
            <span>Oportunidades Abiertas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>
      </div>

      {/* Priority Clients Section (PDF Page 1) */}
      <section className="space-y-3">
        {/* Light Header Bar */}
        <div className="bg-[#E4E7EE] rounded-xl px-5 py-3 flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-bold text-[#090F29] tracking-tight">
            Clientes Que Requieren Tu Atención Hoy
          </h3>

          <div className="flex items-center gap-2">
            {isListSearchOpen && (
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Filtrar lista..."
                  className="bg-white text-[#090F29] placeholder-slate-500 text-xs sm:text-sm rounded-lg pl-3 pr-7 py-1.5 border border-[#355CFF]/60 outline-none focus:border-[#355CFF] w-40 sm:w-56"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => setLocalSearch("")}
                    className="absolute right-2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    aria-label="Limpiar filtro"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (isListSearchOpen && !localSearch) {
                  setIsListSearchOpen(false);
                } else {
                  setIsListSearchOpen((prev) => !prev);
                }
              }}
              aria-label="Buscar en clientes prioritarios"
              title="Filtrar clientes prioritarios"
              className={`w-9 h-9 rounded-full border border-[#355CFF] flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isListSearchOpen
                  ? "bg-[#355CFF] text-white"
                  : "text-[#355CFF] hover:bg-[#355CFF] hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Priority Rows */}
        {priorityClients.length === 0 ? (
          <div className="rounded-xl bg-[#0C184A] border border-[#2F4FE0] py-10 px-6 text-center space-y-3">
            <p className="text-sm font-semibold text-white">
              No hay clientes prioritarios para mostrar con este filtro.
            </p>
            <button
              type="button"
              onClick={onOpenNewLead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E5BFF] hover:bg-[#436DFF] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Lead</span>
            </button>
          </div>
        ) : (
          <div className="max-h-[340px] overflow-y-auto pr-2.5 space-y-3 mercury-light-scroll">
            {priorityClients.map((lead) => {
              const statusCfg = STATUS_BADGE_CONFIG[lead.estado] || {
                label: lead.estado.replace("_", " "),
                className: "bg-[#1D3A8A] text-[#DBEAFE] border-[#3B62F6]",
              };

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectLead(lead);
                    }
                  }}
                  className="bg-[#0C184A] hover:bg-[#122263] border border-[#2F4FE0] rounded-xl px-5 py-4 flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center flex-wrap gap-3 sm:gap-5 min-w-0">
                    <span className="text-sm sm:text-base text-[#E2E8F0] group-hover:text-white font-normal min-w-[140px] sm:min-w-[180px] truncate transition-colors">
                      {lead.empresa || lead.nombre}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </span>

                    <span className="px-3 py-1 rounded-md text-xs font-normal bg-[#162040] border border-[#334155] text-[#D8E0F0] whitespace-nowrap">
                      Resp. {lead.asignadoANombre || "Sin asignar"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                    aria-label={`Ver detalle de ${lead.empresa || lead.nombre}`}
                    className="w-9 h-9 rounded-full border border-[#355CFF] text-[#5B7CFF] group-hover:bg-[#355CFF] group-hover:text-white flex items-center justify-center shrink-0 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
