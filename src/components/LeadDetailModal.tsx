"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { Lead, LeadStatus, VerificationStatus, User as UserType, SalesChecklist } from "../types/crm";
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
  ArrowLeft,
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
  Shield,
  UserCheck,
  Sparkles,
  Target,
  Trophy,
  CheckSquare,
  Square,
  Send,
  Calculator,
  Layers,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { SERVICE_LABELS } from "./PipelineKanban";
import {
  generateVerificationLinks,
  checkDataQuality,
} from "../lib/prospectVerification";
import {
  SALES_STAGES_GUIDE,
  ORDERED_SALES_STAGES,
  calculateSalesProgress,
  getWhatsAppWelcomeTemplate,
  getWhatsAppProposalTemplate,
} from "../lib/salesProcessGuide";

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onGoToQuote: (lead: Lead) => void;
  onUpdateLead?: (updatedLead: Lead) => void;
  currentUser?: UserType | null;
  users?: UserType[];
  onAssignLead?: (leadId: string, assignedUserId: string, assignedUserName: string) => void;
  initialTab?: "guide" | "info" | "verify" | "edit";
  onCreateProject?: (lead: Lead) => void;
  onCreateRetainer?: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onGoToQuote,
  onUpdateLead,
  currentUser,
  users = [],
  onAssignLead,
  initialTab = "guide",
  onCreateProject,
  onCreateRetainer,
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<"guide" | "info" | "verify" | "edit">(initialTab);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

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
    setActiveTab(initialTab);
  }, [lead.id, initialTab]);

  const service = SERVICE_LABELS[lead.servicioInteres];
  const cleanPhone = lead.telefono.replace(/[^0-9]/g, "");

  // Verification calculations
  const links = generateVerificationLinks(lead);
  const quality = checkDataQuality(lead);
  const currentVerification: VerificationStatus = lead.verificacionEstado || "PENDIENTE";

  // Sales Process Guide calculations
  const stageGuide = SALES_STAGES_GUIDE[lead.estado] || SALES_STAGES_GUIDE.NUEVO;
  const progress = useMemo(() => calculateSalesProgress(lead), [lead]);
  const checklist: SalesChecklist = lead.checklistVenta || {};

  const showNotification = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleToggleTask = (taskKey: keyof SalesChecklist) => {
    if (!onUpdateLead) return;
    const currentVal = Boolean(checklist[taskKey]);
    const updatedChecklist: SalesChecklist = {
      ...checklist,
      [taskKey]: !currentVal,
    };
    onUpdateLead({
      ...lead,
      checklistVenta: updatedChecklist,
    });
  };

  const handleAdvanceStage = (targetStatus: LeadStatus) => {
    onUpdateStatus(lead.id, targetStatus);
    if (onUpdateLead) {
      onUpdateLead({
        ...lead,
        estado: targetStatus,
      });
    }
    showNotification(`¡Avanzado con éxito a ${SALES_STAGES_GUIDE[targetStatus]?.shortName || targetStatus}!`);
  };

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
    setActiveTab("guide");
    showNotification("Datos de contacto actualizados.");
  };

  // WhatsApp Templates
  const welcomeMsg = getWhatsAppWelcomeTemplate(lead, currentUser?.nombre);
  const proposalMsg = getWhatsAppProposalTemplate(lead, currentUser?.nombre);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-7 relative space-y-5 scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Title, Service Badge, and Estimated Value */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-10 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${service?.tagClass}`}>
                {service?.name || lead.servicioInteres}
              </span>

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
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Sin auditar</span>
                  </>
                )}
              </span>

              <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                Canal: {lead.origen}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
              <span>{lead.empresa || lead.nombre}</span>
              {lead.estado === "GANADO" && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  Venta Cerrada
                </span>
              )}
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {lead.nombre}
              </span>
              <span className="text-slate-600">•</span>
              <span>{lead.telefono || "Sin teléfono"}</span>
              <span className="text-slate-600">•</span>
              <span>{lead.email || "Sin email"}</span>
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 sm:px-4 sm:py-2.5">
            <span className="text-[11px] text-slate-400 block font-medium">Inversión Estimada</span>
            <span className="text-xl font-black text-emerald-400">
              ${lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
            </span>
          </div>
        </div>

        {/* Toast feedback pill */}
        {copiedToast && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{copiedToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HORIZONTAL SALES FUNNEL STEPPER BAR (Always Visible)                       */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                Ruta Paso a Paso hacia el Cierre
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {progress.progressPercent}% de Cierre
              </span>
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:block">
              {progress.stageCompletedTasksCount} de {progress.stageTotalTasksCount} hitos de esta etapa listos
            </div>
          </div>

          {/* Stepper Buttons 1 to 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {ORDERED_SALES_STAGES.map((st, idx) => {
              const info = SALES_STAGES_GUIDE[st];
              const isCurrent = lead.estado === st;
              const isPassed =
                ORDERED_SALES_STAGES.indexOf(lead.estado) > ORDERED_SALES_STAGES.indexOf(st);

              return (
                <button
                  key={st}
                  onClick={() => {
                    handleAdvanceStage(st);
                    setActiveTab("guide");
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                    isCurrent
                      ? "bg-blue-600/30 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-400/40"
                      : isPassed
                      ? "bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-900/30 text-emerald-300"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : isPassed
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">{info.progressPercent}%</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold truncate block ${
                      isCurrent ? "text-white" : isPassed ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {info.shortName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "guide"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-cyan-300" />
            <span>Guía Paso a Paso al Cierre</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-500/40">
              Paso {stageGuide.stepNumber}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "info"
                ? "bg-slate-800 text-white shadow-md"
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
            <span>Comprobar Redes &amp; Datos</span>
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

        {/* ========================================================================= */}
        {/* TAB 1: GUÍA PASO A PASO AL CIERRE DE LA VENTA (Interactive Sales Wizard)   */}
        {/* ========================================================================= */}
        {activeTab === "guide" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Current Stage Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-blue-500/30 space-y-3.5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${stageGuide.badgeColor}`}>
                      Etapa {stageGuide.stepNumber} de 5
                    </span>
                    <h4 className="text-base font-black text-white">{stageGuide.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {stageGuide.objective}
                  </p>
                </div>

                {/* Next Stage Button */}
                {stageGuide.nextStatus && (
                  <button
                    onClick={() => handleAdvanceStage(stageGuide.nextStatus!)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 active:scale-95"
                  >
                    <span>Avanzar a {SALES_STAGES_GUIDE[stageGuide.nextStatus].shortName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instructions Pills */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-xs">
                {stageGuide.instructions.map((inst, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[11px] leading-snug">{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist of this Stage */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Checklist de Validación de la Etapa
                </span>
                <span className="text-[10px] text-slate-400">
                  Marca cada hito a medida que lo completes con el cliente
                </span>
              </div>

              <div className="space-y-2">
                {stageGuide.tasks.map((task) => {
                  const isChecked = Boolean(checklist[task.key]);

                  return (
                    <div
                      key={task.key}
                      onClick={() => handleToggleTask(task.key)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                          : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black transition-all shrink-0 mt-0.5 ${
                          isChecked
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {isChecked ? "✓" : ""}
                      </button>

                      <div className="min-w-0">
                        <div className={`text-xs font-bold ${isChecked ? "line-through text-slate-400" : "text-white"}`}>
                          {task.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {task.hint}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct 1-Click Stage Tools */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Acciones Comerciales Directas de la Etapa
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Stage 1: NUEVO Actions */}
                {lead.estado === "NUEVO" && (
                  <>
                    {lead.telefono && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(welcomeMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 hover:bg-emerald-900/40 text-white font-bold text-xs transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-300 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                              Enviar WhatsApp de Bienvenida
                            </div>
                            <div className="text-[10px] text-slate-400">Mensaje formal de Mercury CAD precargado</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                    )}

                    <button
                      onClick={() => setActiveTab("verify")}
                      className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/40 hover:bg-purple-900/40 text-white font-bold text-xs transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300">
                            Auditar Redes del Decisor
                          </div>
                          <div className="text-[10px] text-slate-400">Verificar perfil de LinkedIn y web oficial</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </>
                )}

                {/* Stage 2: RELEVAMIENTO Actions */}
                {lead.estado === "RELEVAMIENTO" && (
                  <>
                    <button
                      onClick={() => onGoToQuote(lead)}
                      className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/40 hover:bg-blue-900/40 text-white font-bold text-xs transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center">
                          <Calculator className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-blue-300">
                            Abrir Cotizador CPQ
                          </div>
                          <div className="text-[10px] text-slate-400">Cotizar UX/UI, Web y Mantenimiento</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("edit")}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                          <Edit2 className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">
                            Anotar Minuta &amp; Requerimientos
                          </div>
                          <div className="text-[10px] text-slate-400">Registrar detalles de la llamada</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </>
                )}

                {/* Stage 3: PROPUESTA_ENVIADA Actions */}
                {lead.estado === "PROPUESTA_ENVIADA" && (
                  <>
                    {lead.telefono && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(proposalMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/40 hover:bg-purple-900/40 text-white font-bold text-xs transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center">
                            <Send className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">
                              Enviar Presupuesto por WhatsApp
                            </div>
                            <div className="text-[10px] text-slate-400">Mensaje con valor y llamada de presentación</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                      </a>
                    )}

                    <button
                      onClick={() => onGoToQuote(lead)}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                          <FileCheck className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">
                            Revisar Propuesta en CPQ
                          </div>
                          <div className="text-[10px] text-slate-400">Ajustar módulos o imprimir PDF</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </>
                )}

                {/* Stage 4: EN_NEGOCIACION Actions */}
                {lead.estado === "EN_NEGOCIACION" && (
                  <>
                    <button
                      onClick={() => handleAdvanceStage("GANADO")}
                      className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-between group shadow-lg shadow-emerald-600/30 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                          <Trophy className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">
                            ¡Cerrar Venta y Marcar Ganado!
                          </div>
                          <div className="text-[10px] text-emerald-200">El cliente aprobó la propuesta</div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={() => onGoToQuote(lead)}
                      className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 hover:bg-amber-900/40 text-white font-bold text-xs transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-amber-600/30 text-amber-300 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300">
                            Ajustar Cuotas / Financiación
                          </div>
                          <div className="text-[10px] text-slate-400">Modificar alcance o forma de pago</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </>
                )}

                {/* Stage 5: GANADO Actions (Project / Retainer Creation) */}
                {lead.estado === "GANADO" && (
                  <>
                    {onCreateProject && (
                      <button
                        onClick={() => onCreateProject(lead)}
                        className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-between group shadow-lg shadow-blue-600/30 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">
                              Dar de Alta en Proyectos Activos
                            </div>
                            <div className="text-[10px] text-blue-100">Crear hito en tablero de desarrollo</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    )}

                    {onCreateRetainer && (
                      <button
                        onClick={() => onCreateRetainer(lead)}
                        className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-between group shadow-lg shadow-emerald-700/30 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">
                              Registrar Contrato de Abono (Retainer)
                            </div>
                            <div className="text-[10px] text-emerald-100">Soporte mensual recurrente</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Stage Navigation Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div>
                {stageGuide.previousStatus ? (
                  <button
                    onClick={() => handleAdvanceStage(stageGuide.previousStatus!)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Reabrir etapa anterior ({SALES_STAGES_GUIDE[stageGuide.previousStatus].shortName})</span>
                  </button>
                ) : (
                  <span className="text-slate-600">Primera etapa del embudo comercial</span>
                )}
              </div>

              <div>
                {lead.estado !== "PERDIDO" ? (
                  <button
                    onClick={() => handleAdvanceStage("PERDIDO")}
                    className="text-rose-400 hover:text-rose-300 font-semibold transition-all text-xs"
                  >
                    Marcar como Descartado / Perdido
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdvanceStage("NUEVO")}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-all text-xs"
                  >
                    Reactivar Prospecto
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FICHA GENERAL DEL PROSPECTO                                        */}
        {/* ========================================================================= */}
        {activeTab === "info" && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Account Assignment Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Responsable de la Cartera
                  </span>
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span>{lead.asignadoANombre || "Sin asignar"}</span>
                    {lead.asignadoAId === currentUser?.id && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.2 rounded-full">
                        Tu Cartera
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Reassignment Dropdown */}
              {currentUser?.rol === "ADMIN" && onAssignLead && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-slate-400 text-xs font-medium">Ceder a:</span>
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
                    className="bg-slate-950 border border-purple-500/40 text-purple-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer focus:border-purple-400"
                  >
                    <option value="">Sin Asignar</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.rol})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-900/70 rounded-2xl border border-slate-800">
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
              <h4 className="text-xs font-semibold text-slate-300 mb-1.5">
                Diagnóstico, Dolores y Requerimientos del Cliente:
              </h4>
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                {lead.notas || "Sin notas registradas para este prospecto."}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUDITORÍA DE REDES Y VERIFICACIÓN (Score 0-100)                     */}
        {/* ========================================================================= */}
        {activeTab === "verify" && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetVerification("VERIFICADO")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    currentVerification === "VERIFICADO"
                      ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
                      : "bg-slate-800/80 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/50"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marcar Verificado</span>
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EDICIÓN DE DATOS                                                   */}
        {/* ========================================================================= */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveEdits} className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200">
              Modifica los datos del contacto o agrega notas del relevamiento comercial. Al guardar, se marcará automáticamente como verificado.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre del Decisor / Contacto
                </label>
                <input
                  type="text"
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 text-xs"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 text-xs"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 text-xs"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Notas de Diagnóstico &amp; Relevamiento
              </label>
              <textarea
                rows={4}
                value={editNotas}
                onChange={(e) => setEditNotas(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500 text-xs font-normal"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("guide")}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-500 border border-amber-400/30 shadow-lg shadow-amber-600/30 flex items-center gap-1.5 font-bold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
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
                <span>Abrir WhatsApp</span>
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
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
