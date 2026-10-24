"use client";

import React, { useState, useEffect } from "react";
import { Lead, LeadStatus, VerificationStatus } from "../types/crm";
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  DollarSign,
  Tag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Search,
  Globe,
  Share2,
  Edit2,
  Save,
  RotateCcw,
} from "lucide-react";
import { SERVICE_LABELS } from "./PipelineKanban";
import {
  generateVerificationLinks,
  checkDataQuality,
} from "../lib/prospectVerification";

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onGoToQuote: (lead: Lead) => void;
  onUpdateLead?: (updatedLead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onGoToQuote,
  onUpdateLead,
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<"info" | "verify" | "edit">("info");

  // Edit form states
  const [editNombre, setEditNombre] = useState(lead.nombre);
  const [editEmpresa, setEditEmpresa] = useState(lead.empresa);
  const [editEmail, setEditEmail] = useState(lead.email);
  const [editTelefono, setEditTelefono] = useState(lead.telefono);
  const [editNotas, setEditNotas] = useState(lead.notas);

  // Sync edit form when lead changes
  useEffect(() => {
    setEditNombre(lead.nombre);
    setEditEmpresa(lead.empresa);
    setEditEmail(lead.email);
    setEditTelefono(lead.telefono);
    setEditNotas(lead.notas);
    setActiveTab("info");
  }, [lead.id]);

  const service = SERVICE_LABELS[lead.servicioInteres];
  const cleanPhone = lead.telefono.replace(/[^0-9]/g, "");

  // Verification calculations
  const links = generateVerificationLinks(lead);
  const quality = checkDataQuality(lead);
  const currentVerification: VerificationStatus =
    lead.verificacionEstado || "PENDIENTE";

  const handleSetVerification = (status: VerificationStatus) => {
    if (!onUpdateLead) return;
    const nowStr = new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    onUpdateLead({
      ...lead,
      verificacionEstado: status,
      verificacionFecha: nowStr,
    });
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateLead) return;
    onUpdateLead({
      ...lead,
      nombre: editNombre.trim(),
      empresa: editEmpresa.trim(),
      email: editEmail.trim(),
      telefono: editTelefono.trim(),
      notas: editNotas.trim(),
      verificacionEstado: "VERIFICADO",
      verificacionFecha: new Date().toLocaleDateString("es-AR"),
    });
    setActiveTab("info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl p-6 relative space-y-5 scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Title and Verification Pill */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pr-8">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${service?.tagClass}`}
              >
                {service?.name || lead.servicioInteres}
              </span>

              {/* Verification Badge */}
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  currentVerification === "VERIFICADO"
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                    : currentVerification === "REQUIERE_ACTUALIZACION"
                    ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {currentVerification === "VERIFICADO" ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verificado {lead.verificacionFecha ? `(${lead.verificacionFecha})` : ""}</span>
                  </>
                ) : currentVerification === "REQUIERE_ACTUALIZACION" ? (
                  <>
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>Requiere Actualización</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Pendiente de Auditoría</span>
                  </>
                )}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight">
              {lead.empresa || lead.nombre}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {lead.nombre}
              </span>
              <span className="text-slate-600">•</span>
              <span>Canal: {lead.origen}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Presupuesto Estimado</span>
            <span className="text-xl font-black text-emerald-400">
              ${lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
            </span>
          </div>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "info"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Ficha General</span>
          </button>

          <button
            onClick={() => setActiveTab("verify")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "verify"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-purple-300 hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Comprobar Redes & Datos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-500/40">
              {quality.score}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "edit"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-400 hover:text-amber-300 hover:bg-slate-800/60"
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Contacto</span>
          </button>
        </div>

        {/* TAB 1: INFORMACIÓN GENERAL */}
        {activeTab === "info" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Quick Contact info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-900/70 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Correo Electrónico
                </span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-slate-200 hover:text-blue-400 font-medium flex items-center gap-1.5 mt-1"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">{lead.email || "No registrado"}</span>
                  {quality.isCorporateEmail && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 py-0.2 rounded font-bold">
                      Corporativo
                    </span>
                  )}
                </a>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Teléfono / WhatsApp
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-200 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {lead.telefono || "No registrado"}
                  </span>
                  {lead.telefono && (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Abrir Chat
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Notes & Requirements */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Diagnóstico, Dolores y Propuesta Mercury CAD:</span>
                {links.socialHandle && (
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Canal B2B: @{links.socialHandle}
                  </span>
                )}
              </h4>
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                {lead.notas || "Sin notas registradas para este prospecto."}
              </div>
            </div>

            {/* Change Stage Controls */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-1.5">
                Mover etapa en Pipeline Kanban:
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(
                  [
                    "NUEVO",
                    "RELEVAMIENTO",
                    "PROPUESTA_ENVIADA",
                    "EN_NEGOCIACION",
                    "GANADO",
                  ] as LeadStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateStatus(lead.id, status);
                      onClose();
                    }}
                    className={`p-2 rounded-xl text-[10px] font-semibold transition-all border text-center ${
                      lead.estado === status
                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPROBACIÓN & AUDITORÍA DE REDES */}
        {activeTab === "verify" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Score & Diagnostic Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Índice de Consistencia de Datos
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40">
                    {quality.score} / 100 pts
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Dominio web: <strong className="text-white">@{quality.domain}</strong>{" "}
                  {quality.isCorporateEmail ? "(Institucional Propio)" : "(Público)"}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetVerification("VERIFICADO")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    currentVerification === "VERIFICADO"
                      ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
                      : "bg-slate-800/80 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/50"
                  }`}
                  title="Confirmar que los datos y perfiles son auténticos"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marcar Verificado</span>
                </button>

                <button
                  onClick={() => handleSetVerification("REQUIERE_ACTUALIZACION")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    currentVerification === "REQUIERE_ACTUALIZACION"
                      ? "bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30"
                      : "bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-amber-950/50"
                  }`}
                  title="Marcar si el contacto cambió de puesto o el email no es válido"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Requiere Corrección</span>
                </button>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {quality.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.passed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {item.passed ? "✓" : "!"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct 1-Click Verification Links for Networks */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auditar Presencia en Redes Sociales (1 Clic)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* LinkedIn Company */}
                <a
                  href={links.linkedinCompanyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30 hover:bg-sky-900/40 hover:border-sky-400 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center">
                      in
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-300">
                        LinkedIn Empresa
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {links.socialHandle ? `@${links.socialHandle}` : lead.empresa}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* LinkedIn Person Search */}
                <a
                  href={links.linkedinPersonSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 hover:bg-blue-900/40 hover:border-blue-400 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center">
                      👤
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300">
                        Verificar Decisor en LinkedIn
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Buscar perfil de {lead.nombre}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Official Website */}
                {links.websiteUrl && (
                  <a
                    href={links.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/40 hover:border-emerald-400 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                          Sitio Web Oficial
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {quality.domain}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}

                {/* Instagram Search */}
                <a
                  href={links.instagramSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-pink-950/30 border border-pink-500/30 hover:bg-pink-900/40 hover:border-pink-400 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-pink-600/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center justify-center">
                      IG
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-pink-300">
                        Instagram
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.empresa} en Instagram
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* X / Twitter Search */}
                <a
                  href={links.xSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center">
                      𝕏
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-slate-200">
                        X (Twitter)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Buscar cuentas activas
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Google Search / CUIT */}
                <a
                  href={links.googleCompanyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:bg-amber-900/40 hover:border-amber-400 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">
                        Google &amp; Noticias
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Auditar CUIT y actividad reciente
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EDICIÓN DE DATOS DE CONTACTO */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveEdits} className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
              Si al auditar en LinkedIn o Google descubriste un nuevo gerente comercial, teléfono actualizado o email directo, modifícalo aquí para mantener la base de Mendoza 100% limpia.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre del Decisor / Contacto
                </label>
                <input
                  type="text"
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Empresa / Organización
                </label>
                <input
                  type="text"
                  required
                  value={editEmpresa}
                  onChange={(e) => setEditEmpresa(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Notas de Diagnóstico &amp; Datos de Red Social
              </label>
              <textarea
                rows={4}
                value={editNotas}
                onChange={(e) => setEditNotas(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 border border-amber-400/30 shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar y Marcar Verificado</span>
              </button>
            </div>
          </form>
        )}

        {/* Bottom Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            {lead.telefono && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contactar por WhatsApp</span>
              </a>
            )}
            <button
              onClick={() => onGoToQuote(lead)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Cotizar en CPQ</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-all hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
