"use client";

import React, { useMemo } from "react";
import type { Lead, User } from "../types/crm";
import { SERVICE_LABELS } from "./PipelineKanban";
import {
  Users,
  Sparkles,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  Building,
  Shield,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Kanban,
  FileText,
  UserCheck,
  UserPlus,
} from "lucide-react";

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
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  users,
  leads,
  onOpenNewLead,
  onSelectLead,
  onNavigateTab,
  onAssignLead,
  adminFilterUserId = "ALL",
  setAdminFilterUserId,
}) => {
  const isAdmin = currentUser.rol === "ADMIN";

  // Filter leads according to view
  const userLeads = useMemo(() => {
    if (!isAdmin) {
      // Commercial / PM only sees assigned to them or created by them
      return leads.filter(
        (l) => l.asignadoAId === currentUser.id || l.creadoPorId === currentUser.id
      );
    }

    // Admin view
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

  // Potential leads: NUEVO or RELEVAMIENTO
  const potentialLeads = useMemo(() => {
    return userLeads.filter(
      (l) => l.estado === "NUEVO" || l.estado === "RELEVAMIENTO"
    );
  }, [userLeads]);

  // In Negotiation leads: PROPUESTA_ENVIADA or EN_NEGOCIACION
  const negotiationLeads = useMemo(() => {
    return userLeads.filter(
      (l) => l.estado === "PROPUESTA_ENVIADA" || l.estado === "EN_NEGOCIACION"
    );
  }, [userLeads]);

  // Total Pipeline Value
  const totalPipelineUsd = useMemo(() => {
    return userLeads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
  }, [userLeads]);

  // Own vs Assigned breakdown (for non-admins)
  const ownCreatedCount = useMemo(() => {
    return userLeads.filter((l) => l.creadoPorId === currentUser.id).length;
  }, [userLeads, currentUser.id]);

  const assignedByAdminCount = useMemo(() => {
    return userLeads.filter(
      (l) => l.asignadoAId === currentUser.id && l.creadoPorId !== currentUser.id
    ).length;
  }, [userLeads, currentUser.id]);

  // Priority Clients (Actionable, top 5-6 requiring focus)
  const priorityClients = useMemo(() => {
    return [...userLeads]
      .sort((a, b) => {
        // Prioritize in negotiation, then new with high priority
        const weight = (l: Lead) => {
          let score = 0;
          if (l.estado === "EN_NEGOCIACION") score += 50;
          if (l.estado === "PROPUESTA_ENVIADA") score += 40;
          if (l.estado === "NUEVO") score += 30;
          if (l.prioridad === "Alta") score += 20;
          if (l.tiempoSinContactoHoras && l.tiempoSinContactoHoras > 24) score += 15;
          return score;
        };
        return weight(b) - weight(a);
      })
      .slice(0, 5);
  }, [userLeads]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="glass-panel border border-slate-800/90 rounded-3xl p-6 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/20 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {isAdmin ? "Panel de Dirección" : "Tablero Personal de Gestión"}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ¡Hola, {currentUser.nombre.split(" ")[0]}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {isAdmin
                ? "Vista global y supervisión de la cartera comercial de toda la agencia Mercury CAD."
                : `Aquí tienes la gestión de tus clientes. Administra tus cuentas propias y las asignadas por Dirección.`}
            </p>

            {/* Non-admin portfolio origin pills */}
            {!isAdmin && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/60">
                <span className="text-xs text-slate-400 font-medium">Origen de tu cartera:</span>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700/80">
                  <strong className="text-blue-400 font-bold">{ownCreatedCount}</strong> cargados por ti
                </span>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-950/40 text-purple-300 border border-purple-500/30">
                  <strong className="text-purple-300 font-bold">{assignedByAdminCount}</strong> cedidos por Dirección
                </span>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Admin Filter Dropdown */}
            {isAdmin && setAdminFilterUserId && (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs">
                <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-slate-400 font-medium">Ver Cartera:</span>
                <select
                  value={adminFilterUserId}
                  onChange={(e) => setAdminFilterUserId(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-slate-900 text-white">
                    Toda la Agencia ({leads.length})
                  </option>
                  {users
                    .filter((u) => u.rol !== "ADMIN")
                    .map((u) => {
                      const count = leads.filter((l) => l.asignadoAId === u.id).length;
                      return (
                        <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                          {u.nombre} ({count})
                        </option>
                      );
                    })}
                  <option value="UNASSIGNED" className="bg-slate-900 text-amber-300">
                    Sin Asignar ({leads.filter((l) => !l.asignadoAId).length})
                  </option>
                </select>
              </div>
            )}

            <button
              onClick={onOpenNewLead}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cargar Nuevo Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Visual KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Clientes Propios / Asignados */}
        <div
          onClick={() => onNavigateTab("prospects")}
          className="glass-panel border border-slate-800 hover:border-blue-500/50 p-5 rounded-3xl transition-all hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>{isAdmin ? "Clientes Visibles" : "Mis Clientes"}</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{totalClients}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>{isAdmin ? "Total en cartera seleccionada" : "Cuentas activas a tu cargo"}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Card 2: Clientes Potenciales */}
        <div
          onClick={() => onNavigateTab("pipeline")}
          className="glass-panel border border-slate-800 hover:border-amber-500/50 p-5 rounded-3xl transition-all hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Potenciales</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-amber-300 tracking-tight">
            {potentialLeads.length}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Nuevos o en Relevamiento</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Card 3: En Negociación */}
        <div
          onClick={() => onNavigateTab("pipeline")}
          className="glass-panel border border-slate-800 hover:border-cyan-500/50 p-5 rounded-3xl transition-all hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>En Negociación</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-cyan-300 tracking-tight">
            {negotiationLeads.length}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Propuestas presentadas</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>

        {/* Card 4: Valor Total en Pipeline */}
        <div
          onClick={() => onNavigateTab("pipeline")}
          className="glass-panel border border-slate-800 hover:border-emerald-500/50 p-5 rounded-3xl transition-all hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Pipeline Estimado</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight">
            ${totalPipelineUsd.toLocaleString("es-AR")}
            <span className="text-xs font-bold text-slate-400 ml-1">USD</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Oportunidades abiertas</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </p>
        </div>
      </div>

      {/* Main Focus: Clientes Prioritarios de Hoy */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Clientes que requieren tu atención hoy</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                Foco prioritario
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contactos clave en etapa de propuesta o que requieren seguimiento comercial inmediato.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("prospects")}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>Ver todos mis clientes ({userLeads.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {priorityClients.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">¡Todo al día!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No tienes clientes con alertas pendientes de seguimiento en este momento.
            </p>
            <button
              onClick={onOpenNewLead}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cargar Primer Cliente</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {priorityClients.map((lead) => {
              const service = SERVICE_LABELS[lead.servicioInteres];
              const isAssignedToCurrent = lead.asignadoAId === currentUser.id;
              const isCeded = isAssignedToCurrent && lead.creadoPorId && lead.creadoPorId !== currentUser.id;

              return (
                <div
                  key={lead.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 font-bold shrink-0">
                      {lead.empresa ? lead.empresa.charAt(0).toUpperCase() : lead.nombre.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          onClick={() => onSelectLead(lead)}
                          className="font-bold text-sm text-white group-hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          {lead.empresa || lead.nombre}
                        </h4>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            lead.estado === "EN_NEGOCIACION"
                              ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                              : lead.estado === "PROPUESTA_ENVIADA"
                              ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
                              : lead.estado === "GANADO"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                              : "bg-blue-950/60 text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {lead.estado.replace("_", " ")}
                        </span>

                        {/* Service Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${service.tagClass}`}>
                          {service.name}
                        </span>

                        {/* Ceded by Admin pill */}
                        {isCeded && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5 text-purple-400" />
                            Cedido por Admin
                          </span>
                        )}

                        {/* Admin view: show who is assigned */}
                        {isAdmin && lead.asignadoANombre && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                            Resp: <strong className="text-slate-300">{lead.asignadoANombre}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="text-slate-300 font-medium">{lead.nombre}</span>
                        <span>•</span>
                        <span>{lead.email}</span>
                        {lead.telefono && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{lead.telefono}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Budget */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                        Presupuesto
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        ${lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Direct WhatsApp link if phone exists */}
                      {lead.telefono && (
                        <a
                          href={`https://wa.me/${lead.telefono.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-slate-300 transition-all text-xs"
                          title="Contactar vía WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* View Lead Button */}
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>Ver Ficha</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Admin Quick Re-assign dropdown */}
                      {isAdmin && onAssignLead && (
                        <select
                          value={lead.asignadoAId || ""}
                          onChange={(e) => {
                            const selectedUser = users.find((u) => u.id === e.target.value);
                            onAssignLead(
                              lead.id,
                              e.target.value,
                              selectedUser ? selectedUser.nombre : "Sin Asignar"
                            );
                          }}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold rounded-xl px-2 py-1.5 outline-none hover:border-purple-500/50 cursor-pointer"
                          title="Ceder / Reasignar cliente"
                        >
                          <option value="">Sin Asignar</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              Ceder a: {u.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3 Quick Action Shortcuts (Clean & focused) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab("pipeline")}
          className="p-4 rounded-2xl glass-panel border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Kanban className="w-4 h-4" />
            </span>
            <div>
              <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                Pipeline Kanban
              </h5>
              <p className="text-[11px] text-slate-400">Ver y arrastrar etapas del embudo</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => onNavigateTab("prospects")}
          className="p-4 rounded-2xl glass-panel border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Building className="w-4 h-4" />
            </span>
            <div>
              <h5 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                Directorio Completo
              </h5>
              <p className="text-[11px] text-slate-400">Explorar cartera con filtros avanzados</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => onNavigateTab("quotes")}
          className="p-4 rounded-2xl glass-panel border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Cotizador CPQ
              </h5>
              <p className="text-[11px] text-slate-400">Calcular y generar propuestas</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
