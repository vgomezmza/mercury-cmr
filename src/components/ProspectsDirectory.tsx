"use client";

import React, { useState, useMemo } from "react";
import type { Lead, LeadStatus, ServiceType, VerificationStatus, User as UserType } from "../types/crm";
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
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserPlus,
} from "lucide-react";
import { extractSocialHandle } from "../lib/prospectVerification";

interface ProspectsDirectoryProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onGoToQuote: (lead: Lead) => void;
  onOpenNewLead?: () => void;
  currentUser?: UserType | null;
  users?: UserType[];
  onAssignLead?: (leadId: string, assignedUserId: string, assignedUserName: string) => void;
}

export const ProspectsDirectory: React.FC<ProspectsDirectoryProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onGoToQuote,
  onOpenNewLead,
  currentUser,
  users = [],
  onAssignLead,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("TODOS");
  const [selectedStatus, setSelectedStatus] = useState("TODOS");
  const [selectedVerification, setSelectedVerification] = useState("TODOS");
  const [selectedAssigned, setSelectedAssigned] = useState("TODOS");
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

      const matchVerification =
        selectedVerification === "TODOS"
          ? true
          : selectedVerification === "PENDIENTE"
          ? !lead.verificacionEstado || lead.verificacionEstado === "PENDIENTE"
          : lead.verificacionEstado === selectedVerification;

      const matchAssigned =
        selectedAssigned === "TODOS"
          ? true
          : selectedAssigned === "UNASSIGNED"
          ? !lead.asignadoAId
          : lead.asignadoAId === selectedAssigned;

      return matchSearch && matchService && matchStatus && matchVerification && matchAssigned;
    });
  }, [leads, searchTerm, selectedService, selectedStatus, selectedVerification, selectedAssigned]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalValue = useMemo(() => {
    return leads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
  }, [leads]);

  const verifiedCount = useMemo(() => {
    return leads.filter((l) => l.verificacionEstado === "VERIFICADO").length;
  }, [leads]);

  const pendingCount = useMemo(() => {
    return leads.filter(
      (l) => !l.verificacionEstado || l.verificacionEstado === "PENDIENTE"
    ).length;
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
            <span>Potencial Pipeline</span>
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
            <span>Auditoría de Datos</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5 flex items-baseline gap-2">
            <span>{verifiedCount}</span>
            <span className="text-xs font-normal text-slate-400">
              / {leads.length} auditados
            </span>
          </div>
          <p className="text-[11px] text-purple-300 mt-0.5">
            {pendingCount} pendientes de validación en redes.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase">
            <span>Canal B2B Principal</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">LinkedIn &amp; Redes</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            1-clic a perfiles, decisores y dominios web.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
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
          {/* Verification Status Filter */}
          <select
            value={selectedVerification}
            onChange={(e) => {
              setSelectedVerification(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-purple-500/40 text-purple-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-400 font-medium"
          >
            <option value="TODOS">Todas las Auditorías</option>
            <option value="VERIFICADO">✓ Solo Verificados ({verifiedCount})</option>
            <option value="PENDIENTE">🕒 Pendientes ({pendingCount})</option>
            <option value="REQUIERE_ACTUALIZACION">⚠ Requieren Actualización</option>
          </select>

          {/* Service Filter */}
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

          {/* Pipeline Stage Filter */}
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

          {/* Admin Collaborator Filter */}
          {currentUser?.rol === "ADMIN" && (
            <select
              value={selectedAssigned}
              onChange={(e) => {
                setSelectedAssigned(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-400 font-medium"
            >
              <option value="TODOS">Todos los Responsables</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
              <option value="UNASSIGNED">Sin Asignar</option>
            </select>
          )}

          {onOpenNewLead && (
            <button
              onClick={onOpenNewLead}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
              title="Buscar o cargar un nuevo prospecto con el radar de redes sociales"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Buscar / Nuevo Lead</span>
            </button>
          )}
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
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3">Desafío &amp; Propuesta Mercury</th>
                <th className="py-3 px-3 text-center">Auditoría Redes</th>
                <th className="py-3 px-3 text-right">Presupuesto</th>
                <th className="py-3 px-3 text-center">Etapa</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No se encontraron prospectos que coincidan con la búsqueda o filtro seleccionado.
                  </td>
                </tr>
              ) : (
                paginated.map((lead) => {
                  const service = SERVICE_LABELS[lead.servicioInteres];
                  const handle = extractSocialHandle(lead.notas);
                  const verStatus = lead.verificacionEstado || "PENDIENTE";

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

                      {/* Responsable */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {lead.asignadoANombre ? (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                lead.asignadoAId === currentUser?.id
                                  ? "bg-blue-950/80 text-blue-300 border-blue-500/40"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {lead.asignadoAId === currentUser?.id ? "Tú" : lead.asignadoANombre}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400/80 italic">Sin asignar</span>
                          )}

                          {currentUser?.rol === "ADMIN" && onAssignLead && (
                            <select
                              value={lead.asignadoAId || ""}
                              onChange={(e) => {
                                const selected = users.find((u) => u.id === e.target.value);
                                onAssignLead(
                                  lead.id,
                                  e.target.value,
                                  selected ? selected.nombre : "Sin Asignar"
                                );
                              }}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded-lg px-1.5 py-0.5 outline-none hover:border-purple-400 cursor-pointer"
                              title="Ceder a otro colaborador"
                            >
                              <option value="">Ceder...</option>
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.nombre}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Desafío y Propuesta */}
                      <td className="py-3 px-3 max-w-sm">
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {lead.notas}
                        </p>
                      </td>

                      {/* Auditoría Redes / Verificación */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          {verStatus === "VERIFICADO" ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Verificado</span>
                            </span>
                          ) : verStatus === "REQUIERE_ACTUALIZACION" ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                              <span>Por Corregir</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>Sin Auditar</span>
                            </span>
                          )}

                          {handle && (
                            <span className="text-[9px] text-cyan-400 font-mono">
                              @{handle}
                            </span>
                          )}
                        </div>
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
