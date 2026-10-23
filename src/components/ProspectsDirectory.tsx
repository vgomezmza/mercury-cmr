"use client";

import React, { useState, useMemo } from "react";
import { Lead, LeadStatus, ServiceType } from "../types/crm";
import { SERVICE_LABELS } from "./PipelineKanban";
import {
  Building2,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  ArrowRight,
  FileCheck,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Tag,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ProspectsDirectoryProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onGoToQuote: (lead: Lead) => void;
}

export const ProspectsDirectory: React.FC<ProspectsDirectoryProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onGoToQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("TODOS");
  const [selectedStatus, setSelectedStatus] = useState("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter leads
  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.notas.toLowerCase().includes(searchTerm.toLowerCase());

      const matchService =
        selectedService === "TODOS" || lead.servicioInteres === selectedService;

      const matchStatus =
        selectedStatus === "TODOS" || lead.estado === selectedStatus;

      return matchSearch && matchService && matchStatus;
    });
  }, [leads, searchTerm, selectedService, selectedStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalValue = useMemo(() => {
    return leads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
  }, [leads]);

  return (
    <div className="space-y-5">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold uppercase">
            <span>Total Prospectos</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{leads.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Empresas y directivos relevados en Mendoza y Cuyo.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase">
            <span>Potencial Total Pipeline</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            ${totalValue.toLocaleString("es-AR")} USD
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ticket estimado promedio por proyecto.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase">
            <span>Alta Prioridad</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {leads.filter((l) => l.prioridad === "Alta").length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Empresas con +50 empleados y desafíos de alto impacto.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase">
            <span>Canal Principal</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">LinkedIn B2B</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            100% de perfiles corporativos identificados.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por empresa, contacto, industria o desafío..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos los Servicios</option>
            {Object.entries(SERVICE_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todas las Etapas</option>
            <option value="NUEVO">Nuevo Prospecto</option>
            <option value="RELEVAMIENTO">En Relevamiento</option>
            <option value="PROPUESTA_ENVIADA">Propuesta Enviada</option>
            <option value="EN_NEGOCIACION">En Negociación</option>
            <option value="GANADO">Ganado</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Empresa / Contacto</th>
                <th className="py-3 px-3">Servicio Sugerido</th>
                <th className="py-3 px-3">Desafío & Propuesta Mercury</th>
                <th className="py-3 px-3 text-right">Presupuesto</th>
                <th className="py-3 px-3 text-center">Etapa</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No se encontraron prospectos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                paginated.map((lead) => {
                  const service = SERVICE_LABELS[lead.servicioInteres];

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Empresa y Contacto */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                          {lead.empresa}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{lead.nombre}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-blue-400">{lead.email}</span>
                        </div>
                      </td>

                      {/* Servicio */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            service?.tagClass || "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {service?.name || lead.servicioInteres}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                          {lead.origen}
                        </span>
                      </td>

                      {/* Desafío y Propuesta */}
                      <td className="py-3 px-3 max-w-md">
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {lead.notas}
                        </p>
                      </td>

                      {/* Presupuesto */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="font-bold text-emerald-400">
                          ${lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                            lead.prioridad === "Alta"
                              ? "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                              : "bg-slate-900 text-slate-400"
                          }`}
                        >
                          Prioridad {lead.prioridad}
                        </span>
                      </td>

                      {/* Etapa */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                          {lead.estado.replace("_", " ")}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onGoToQuote(lead)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all"
                            title="Cotizar en CPQ"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                          {lead.estado === "NUEVO" ? (
                            <button
                              onClick={() => onUpdateStatus(lead.id, "RELEVAMIENTO")}
                              className="px-2 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-semibold transition-all flex items-center gap-1"
                              title="Pasar a Relevamiento"
                            >
                              <span>Contactar</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectLead(lead)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-all"
                            >
                              Ver Ficha
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filtered.length)} de{" "}
              {filtered.length} prospectos
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs transition-all"
              >
                Anterior
              </button>
              <span className="px-2 font-semibold text-slate-200">
                Pág. {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
