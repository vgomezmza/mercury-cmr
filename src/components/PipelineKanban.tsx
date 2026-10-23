"use client";

import React, { useState } from "react";
import {
  Lead,
  LeadStatus,
  ServiceType,
  SocialPlatform,
} from "../types/crm";
import {
  DollarSign,
  Building,
  User,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Filter,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface PipelineKanbanProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, newStatus: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
  filterService: string;
  setFilterService: (service: string) => void;
}

const COLUMNS: { id: LeadStatus; label: string; color: string; dotColor: string }[] = [
  { id: "NUEVO", label: "Nuevo Lead", color: "border-blue-500/30", dotColor: "bg-blue-400" },
  { id: "RELEVAMIENTO", label: "Relevamiento / Diagnóstico", color: "border-purple-500/30", dotColor: "bg-purple-400" },
  { id: "PROPUESTA_ENVIADA", label: "Propuesta Enviada", color: "border-cyan-500/30", dotColor: "bg-cyan-400" },
  { id: "EN_NEGOCIACION", label: "En Negociación", color: "border-amber-500/30", dotColor: "bg-amber-400" },
  { id: "GANADO", label: "Ganado (Pase a Proyecto)", color: "border-emerald-500/30", dotColor: "bg-emerald-400" },
];

export const SERVICE_LABELS: Record<ServiceType, { name: string; tagClass: string }> = {
  UX_UI: { name: "Diseño UX/UI", tagClass: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  WEB_DEVELOPMENT: { name: "Desarrollo Web", tagClass: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  CUSTOM_SOFTWARE: { name: "Software a Medida", tagClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  META_GOOGLE_ADS: { name: "Google & Meta Ads", tagClass: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  BRANDING: { name: "Branding & Social", tagClass: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  MONTHLY_MAINTENANCE: { name: "Mantenimiento Web", tagClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

const ORIGIN_ICONS: Record<string, { label: string; bg: string; text: string }> = {
  "Facebook Ads": { label: "FB", bg: "bg-blue-900/60", text: "text-blue-300" },
  "Instagram DM": { label: "IG", bg: "bg-fuchsia-950/70", text: "text-pink-300" },
  "LinkedIn": { label: "in", bg: "bg-sky-950/80", text: "text-sky-300" },
  "X (Twitter)": { label: "𝕏", bg: "bg-slate-900/90", text: "text-slate-200" },
  "Web MercuryCAD": { label: "WEB", bg: "bg-indigo-950/70", text: "text-indigo-300" },
  "Referido": { label: "REF", bg: "bg-emerald-950/70", text: "text-emerald-300" },
};

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  leads,
  onUpdateLeadStatus,
  onSelectLead,
  filterService,
  setFilterService,
}) => {
  const nextStatusMap: Record<LeadStatus, LeadStatus | null> = {
    NUEVO: "RELEVAMIENTO",
    RELEVAMIENTO: "PROPUESTA_ENVIADA",
    PROPUESTA_ENVIADA: "EN_NEGOCIACION",
    EN_NEGOCIACION: "GANADO",
    GANADO: null,
    PERDIDO: null,
  };

  const prevStatusMap: Record<LeadStatus, LeadStatus | null> = {
    NUEVO: null,
    RELEVAMIENTO: "NUEVO",
    PROPUESTA_ENVIADA: "RELEVAMIENTO",
    EN_NEGOCIACION: "PROPUESTA_ENVIADA",
    GANADO: "EN_NEGOCIACION",
    PERDIDO: "NUEVO",
  };

  const filteredLeads = filterService === "TODOS"
    ? leads
    : leads.filter((l) => l.servicioInteres === filterService);

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-2 pr-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Servicio:
          </span>
          <button
            onClick={() => setFilterService("TODOS")}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              filterService === "TODOS"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Todos ({leads.length})
          </button>
          {Object.entries(SERVICE_LABELS).map(([key, value]) => {
            const count = leads.filter((l) => l.servicioInteres === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterService(key)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  filterService === key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {value.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-800">
          Total en Pipeline:{" "}
          <span className="font-bold text-emerald-400 text-sm">
            ${leads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0).toLocaleString("es-AR")} USD
          </span>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.estado === col.id);
          const colTotal = colLeads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl glass-panel p-3 border-t-2 ${col.color} bg-slate-900/40 min-h-[540px] transition-all`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {colLeads.length}
                </span>
              </div>

              {/* Subtotal of column */}
              <div className="text-[11px] text-slate-400 font-medium mb-3 px-1 flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-200 font-semibold">${colTotal.toLocaleString("es-AR")} USD</span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
                {colLeads.length === 0 ? (
                  <div className="h-28 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                    Sin prospectos
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const originStyle = ORIGIN_ICONS[lead.origen] || {
                      label: "WEB",
                      bg: "bg-slate-800",
                      text: "text-slate-300",
                    };
                    const serviceInfo = SERVICE_LABELS[lead.servicioInteres] || {
                      name: lead.servicioInteres,
                      tagClass: "bg-slate-800 text-slate-300 border-slate-700",
                    };

                    const isUrgent = (lead.tiempoSinContactoHoras || 0) >= 48 && lead.estado !== "GANADO";

                    return (
                      <div
                        key={lead.id}
                        className="glass-card rounded-xl p-3.5 space-y-2.5 cursor-pointer relative group"
                        onClick={() => onSelectLead(lead)}
                      >
                        {/* Card Header: Service Tag & Origin */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${serviceInfo.tagClass} truncate max-w-[130px]`}
                          >
                            {serviceInfo.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-700 ${originStyle.bg} ${originStyle.text}`}
                            title={`Origen: ${lead.origen}`}
                          >
                            {originStyle.label}
                          </span>
                        </div>

                        {/* Company & Contact Name */}
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight line-clamp-1">
                            {lead.empresa || lead.nombre}
                          </h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="truncate">{lead.nombre}</span>
                          </p>
                        </div>

                        {/* Estimated Value */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <div className="text-xs font-bold text-emerald-400 flex items-center">
                            <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                            {lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
                          </div>

                          {isUrgent && (
                            <span
                              className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-500/40 px-1.5 py-0.2 rounded-md flex items-center gap-1 font-medium animate-pulse"
                              title="Más de 48 hs sin contacto comercial"
                            >
                              <AlertCircle className="w-3 h-3" />
                              +48h
                            </span>
                          )}
                        </div>

                        {/* Short Notes snippet */}
                        {lead.notas && (
                          <p className="text-[11px] text-slate-400/90 line-clamp-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60 leading-relaxed">
                            {lead.notas}
                          </p>
                        )}

                        {/* Quick Step Navigation Buttons */}
                        <div
                          className="flex items-center justify-between pt-1.5 border-t border-slate-800/80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatusMap[lead.estado] ? (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, prevStatusMap[lead.estado]!)}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
                              title="Retroceder etapa"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span />
                          )}

                          <span className="text-[10px] text-slate-500 font-medium">
                            {lead.createdAt}
                          </span>

                          {nextStatusMap[lead.estado] ? (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, nextStatusMap[lead.estado]!)}
                              className="px-2 py-0.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                              title="Avanzar etapa"
                            >
                              <span>Avanzar</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Listo
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
