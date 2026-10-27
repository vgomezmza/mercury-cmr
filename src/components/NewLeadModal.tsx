"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Lead, ServiceType, User } from "../types/crm";
import {
  X,
  UserPlus,
  DollarSign,
  Sparkles,
  Search,
  ExternalLink,
  Globe,
  Share2,
  Check,
  AlertCircle,
  Radio,
  MapPin,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  Shield,
  Layers,
  Code2,
  TrendingUp,
  Palette,
  Clock,
  Target,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { SERVICE_LABELS } from "./PipelineKanban";
import {
  generateScoutSuggestions,
  findPotentialDuplicates,
  ScoutSuggestion,
} from "../lib/prospectScout";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
  existingLeads?: Lead[];
  currentUser?: User | null;
  users?: User[];
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
  existingLeads = [],
  currentUser,
  users = [],
}) => {
  // 3-Step Wizard Navigation: 1 = Contacto & Decisor, 2 = Diagnóstico & Servicio, 3 = Presupuesto & Plan de Cierre
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicioInteres, setServicioInteres] = useState<ServiceType>("UX_UI");
  const [valorEstimado, setValorEstimado] = useState<number>(2500);
  const [origen, setOrigen] = useState<Lead["origen"]>("Web MercuryCAD");
  const [notas, setNotas] = useState("");
  const [prioridad, setPrioridad] = useState<"Alta" | "Media" | "Baja">("Alta");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [assignedUserId, setAssignedUserId] = useState<string>(currentUser?.id || "");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setAssignedUserId(currentUser.id);
    }
  }, [currentUser, isOpen]);

  // Reset step to 1 whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setValidationError(null);
    }
  }, [isOpen]);

  // Generate live social & web scout suggestions
  const suggestions: ScoutSuggestion | null = useMemo(() => {
    return generateScoutSuggestions(empresa, nombre);
  }, [empresa, nombre]);

  // Check for potential duplicate prospects in current CRM database
  const potentialDuplicates = useMemo(() => {
    const target = empresa.trim() || nombre.trim();
    return findPotentialDuplicates(target, existingLeads);
  }, [empresa, nombre, existingLeads]);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2500);
  };

  // Quick Action: Link LinkedIn
  const handleLinkLinkedIn = () => {
    if (!suggestions) return;
    setOrigen("LinkedIn");
    const tag = `Red: LinkedIn@${suggestions.companyHandle}.`;
    if (!notas.includes(tag)) {
      setNotas((prev) => (prev ? `${prev} | ${tag}` : tag));
    }
    showFeedback("Canal de origen y handle de LinkedIn vinculados al prospecto.");
  };

  // Quick Action: Link Instagram
  const handleLinkInstagram = () => {
    if (!suggestions) return;
    setOrigen("Instagram DM");
    const tag = `Red: Instagram@${suggestions.instagramHandle}.`;
    if (!notas.includes(tag)) {
      setNotas((prev) => (prev ? `${prev} | ${tag}` : tag));
    }
    showFeedback("Canal Instagram vinculado al prospecto.");
  };

  // Quick Action: Apply Corporate Domain to Email
  const handleApplyDomain = (domain: string) => {
    if (!email || email.includes("@gmail") || email.includes("@hotmail")) {
      const alias = nombre
        ? nombre.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : "contacto";
      setEmail(`${alias}@${domain}`);
      showFeedback(`Email corporativo configurado como @${domain}`);
    } else {
      const prefix = email.split("@")[0];
      setEmail(`${prefix}@${domain}`);
      showFeedback(`Dominio de correo actualizado a @${domain}`);
    }
  };

  // Quick Action: Autofill all suggested data
  const handleAutofillAll = () => {
    if (!suggestions) return;
    const primaryDomain = suggestions.candidateDomains[0];
    if (!email) {
      const alias = nombre
        ? nombre.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : "contacto";
      setEmail(`${alias}@${primaryDomain}`);
    }
    setOrigen("LinkedIn");
    const tags = `Red: LinkedIn@${suggestions.companyHandle}. Dominio: ${primaryDomain}. Relevamiento en redes comerciales.`;
    setNotas((prev) => (prev ? `${prev}\n${tags}` : tags));
    showFeedback("¡Datos y redes sugeridas aplicados en el formulario!");
  };

  const handleTestExample = (exEmpresa: string, exNombre: string) => {
    setEmpresa(exEmpresa);
    setNombre(exNombre);
    setValidationError(null);
  };

  // Step 1 Validation
  const handleGoToStep2 = () => {
    if (!empresa.trim() && !nombre.trim()) {
      setValidationError("Ingresa el nombre de la empresa o del decisor para continuar.");
      return;
    }
    setValidationError(null);
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleGoToStep3 = () => {
    setValidationError(null);
    setCurrentStep(3);
  };

  // Final Submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nombre.trim() && !empresa.trim()) {
      setCurrentStep(1);
      setValidationError("El nombre o empresa es obligatorio.");
      return;
    }

    const assignedUser = users.find((u) => u.id === assignedUserId) || currentUser;
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      nombre: nombre.trim() || empresa.trim(),
      empresa: empresa.trim() || nombre.trim(),
      email: email.trim() || `contacto@${suggestions?.candidateDomains[0] || "empresa.com.ar"}`,
      telefono: telefono.trim() || "+54 261 400-0000",
      servicioInteres,
      estado: "NUEVO",
      valorEstimado,
      moneda: "USD",
      origen,
      notas: notas.trim() || (suggestions ? `Red: LinkedIn@${suggestions.companyHandle}` : "Nuevo prospecto relevado."),
      prioridad,
      createdAt: "Recién ingresado",
      tiempoSinContactoHoras: 0,
      verificacionEstado: "PENDIENTE",
      creadoPorId: currentUser?.id,
      asignadoAId: assignedUser?.id || currentUser?.id,
      asignadoANombre: assignedUser?.nombre || currentUser?.nombre,
      checklistVenta: {
        contactoValidado: Boolean(telefono.trim() || email.trim()),
        radarRedesRevisado: Boolean(suggestions),
        primerMensajeEnviado: false,
      },
    };

    onSaveLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-7 relative scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Wizard Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Asistente Paso a Paso de Cliente Potencial
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  Ruta de Cierre
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Completa los datos del prospecto guiado en 3 pasos para activar su ruta de ventas hasta el cierre.
              </p>
            </div>
          </div>

          {/* Stepper Pill Indicators */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-poppins ${
                currentStep === 1
                  ? "bg-[#375EFB] text-white shadow-md shadow-[#375EFB]/30 ring-1 ring-white/20"
                  : currentStep > 1
                  ? "text-emerald-400 hover:bg-slate-800"
                  : "text-slate-500"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 1 ? "bg-white text-[#2e3194]" : currentStep > 1 ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}>
                {currentStep > 1 ? "✓" : "1"}
              </span>
              <span>Contacto</span>
            </button>

            <span className="text-slate-700">➔</span>

            <button
              type="button"
              onClick={() => (empresa.trim() || nombre.trim() ? setCurrentStep(2) : handleGoToStep2())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-poppins ${
                currentStep === 2
                  ? "bg-[#375EFB] text-white shadow-md shadow-[#375EFB]/30 ring-1 ring-white/20"
                  : currentStep > 2
                  ? "text-emerald-400 hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 2 ? "bg-white text-[#2e3194]" : currentStep > 2 ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}>
                {currentStep > 2 ? "✓" : "2"}
              </span>
              <span>Diagnóstico</span>
            </button>

            <span className="text-slate-700">➔</span>

            <button
              type="button"
              onClick={() => (empresa.trim() || nombre.trim() ? setCurrentStep(3) : handleGoToStep2())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-poppins ${
                currentStep === 3
                  ? "bg-[#375EFB] text-white shadow-md shadow-[#375EFB]/30 ring-1 ring-white/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 3 ? "bg-white text-[#2e3194]" : "bg-slate-800 text-slate-400"
              }`}>
                3
              </span>
              <span>Cierre</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Feedback pill */}
        {copiedNotification && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 1: IDENTIFICACIÓN Y CONTACTO (+ RADAR SOCIAL)                         */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Form Left Side */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    Paso 1: Identificación del Prospecto
                  </span>
                  <span className="text-[10px] text-amber-400">* Obligatorio</span>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Empresa / Organización *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder="ej. Bodega Catena Zapata, Triunfo Seguros..."
                      value={empresa}
                      onChange={(e) => {
                        setEmpresa(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-medium text-xs"
                    />
                    {empresa && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400 font-mono">
                        Auditando radar...
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Nombre del Decisor / Contacto Clave
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ej. Laura Catena, Carlos Sánchez..."
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-medium text-xs"
                    />
                    {nombre && (
                      <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Vías de Comunicación Directa
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="contacto@empresa.com.ar"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Teléfono / WhatsApp Directo
                    </label>
                    <input
                      type="tel"
                      placeholder="+54 261 4..."
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleGoToStep2}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 text-xs"
                >
                  <span>Continuar a Diagnóstico y Servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Radar Right Side */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-cyan-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <Radio className="w-4 h-4 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Radar de Presencia Digital &amp; Redes
                      </h4>
                      <p className="text-[10px] text-cyan-300/80">
                        Audita perfiles en LinkedIn, Instagram y dominios corporativos.
                      </p>
                    </div>
                  </div>

                  {suggestions && (
                    <button
                      type="button"
                      onClick={handleAutofillAll}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-400/40 text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="Aplica el dominio y el perfil social al formulario con un clic"
                    >
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Autocompletar Todo</span>
                    </button>
                  )}
                </div>

                {!suggestions && (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                      <Search className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-200">
                        Esperando nombre de Empresa o Decisor
                      </h5>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Escribe el nombre de un cliente potencial a la izquierda para generar enlaces directos a LinkedIn, Instagram y dominios web.
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-slate-500 block mb-1.5 uppercase font-semibold">
                        O prueba con un ejemplo de Mendoza:
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTestExample("Bodega Norton", "Michael Halstrick")}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-all"
                        >
                          Bodega Norton
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTestExample("Energe Solar", "Alexis Atem")}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-all"
                        >
                          Energe Solar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTestExample("Andesmar", "Mauricio Badaloni")}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-all"
                        >
                          Andesmar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {suggestions && (
                  <div className="space-y-3 text-xs animate-in fade-in duration-200">
                    {potentialDuplicates.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>¡Coincidencia detectada en el CRM! ({potentialDuplicates.length})</span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {potentialDuplicates.map((dup) => (
                            <div
                              key={dup.id}
                              className="p-2 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <strong className="text-white">{dup.empresa}</strong>
                                <span className="text-slate-400 ml-1">({dup.nombre})</span>
                              </div>
                              <span className="text-[10px] text-amber-400 font-mono">
                                {dup.estado}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social profiles */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Perfiles de Redes Sociales Sugeridos
                      </span>

                      {/* LinkedIn Company */}
                      <div className="p-2.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 hover:border-sky-400/60 transition-all flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                            in
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              LinkedIn Empresa
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              @{suggestions.companyHandle}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={suggestions.linkedinCompanyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={handleLinkLinkedIn}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-sky-900/60 text-sky-300 border border-sky-500/30 text-[10px] font-semibold transition-all"
                          >
                            ✓ Vincular
                          </button>
                        </div>
                      </div>

                      {/* Instagram Profile */}
                      <div className="p-2.5 rounded-2xl bg-pink-950/30 border border-pink-500/30 hover:border-pink-400/60 transition-all flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-pink-600/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center justify-center shrink-0">
                            IG
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              Instagram Oficial
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              @{suggestions.instagramHandle}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={suggestions.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={handleLinkInstagram}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-pink-900/60 text-pink-300 border border-pink-500/30 text-[10px] font-semibold transition-all"
                          >
                            ✓ Vincular
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Official Website */}
                    <div className="space-y-2 pt-1">
                      <div className="p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white font-mono truncate">
                              https://{suggestions.candidateDomains[0]}
                            </span>
                          </div>
                          <a
                            href={suggestions.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>Visitar</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-emerald-500/20">
                          <span className="text-[10px] text-slate-400">Aplicar dominio:</span>
                          {suggestions.candidateDomains.map((dom) => (
                            <button
                              key={dom}
                              type="button"
                              onClick={() => handleApplyDomain(dom)}
                              className="px-2 py-0.5 rounded-md bg-emerald-900/50 hover:bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-[10px] font-mono transition-all"
                            >
                              @{dom}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 2: DIAGNÓSTICO DE NECESIDADES Y SERVICIO                              */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Paso 2: ¿Qué servicio necesita {empresa || "el cliente"}?
                </span>

                {/* Service Cards Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {Object.entries(SERVICE_LABELS).map(([key, val]) => {
                    const isSelected = servicioInteres === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setServicioInteres(key as ServiceType)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            isSelected ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isSelected ? "✓" : "•"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{val.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {key === "UX_UI" && "Diseño Figma & Wireframes"}
                            {key === "WEB_DEVELOPMENT" && "Sitio Web, Landing o E-commerce"}
                            {key === "CUSTOM_SOFTWARE" && "Sistema a medida o portal B2B"}
                            {key === "META_GOOGLE_ADS" && "Campañas de pauta y conversión"}
                            {key === "BRANDING" && "Identidad de marca y manual"}
                            {key === "MONTHLY_MAINTENANCE" && "Abono soporte y mejoras"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Canal de Captación / Origen
                    </label>
                    <select
                      value={origen}
                      onChange={(e) => setOrigen(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="LinkedIn">LinkedIn (Prospección / InMail)</option>
                      <option value="WhatsApp">WhatsApp Web / Mensaje Directo</option>
                      <option value="Instagram DM">Instagram DM</option>
                      <option value="Facebook Ads">Facebook / Meta Ads</option>
                      <option value="X (Twitter)">X (Twitter)</option>
                      <option value="Web MercuryCAD">Web MercuryCAD (Formulario)</option>
                      <option value="Referido">Referido Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Contacto Responsable en Mercury CAD
                    </label>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>{currentUser?.nombre || "Comercial Asignado"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">
                    Diagnóstico Inicial &amp; Dolores a Resolver
                  </label>
                  <textarea
                    rows={4}
                    placeholder="¿Qué problema concreto tienen? ej: Su web actual no convierte en móviles, necesitan cotizador automático, software para distribuidores..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500 leading-relaxed font-normal text-xs"
                  />
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Contacto</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoToStep3}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 text-xs"
                >
                  <span>Continuar a Presupuesto y Cierre</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 2 Right: Guide Tips */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/30 space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Buenas Prácticas de Diagnóstico
                    </h4>
                    <p className="text-[10px] text-purple-300">
                      Mercury CAD Agencia Digital Mendoza
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-0.5">1. Identifica el dolor real</strong>
                    <span>No vendas solo "diseño web". Averigua si pierden ventas por falta de catálogo online o si su proceso comercial es manual.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-0.5">2. Valida tiempos de entrega</strong>
                    <span>Pregúntale cuándo tienen previsto el lanzamiento (vendimias, temporada alta, ferias comerciales).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-0.5">3. Propuesta CPQ en 24 horas</strong>
                    <span>Al crear el prospecto tendrás acceso directo al Cotizador CPQ para entregar el presupuesto formal en PDF.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 3: PRESUPUESTO, ASIGNACIÓN Y RUTA DE CIERRE                          */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Paso 3: Estimación y Prioridad Comercial
                </span>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">
                      Presupuesto Estimado (USD)
                    </label>
                    <span className="text-xs font-black text-emerald-400">
                      ${valorEstimado.toLocaleString("es-AR")} USD
                    </span>
                  </div>
                  <input
                    type="number"
                    step={100}
                    value={valorEstimado}
                    onChange={(e) => setValorEstimado(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-sm"
                  />
                  {/* Preset budget buttons */}
                  <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                    <span className="text-[10px] text-slate-500">Valores típicos:</span>
                    {[900, 1600, 2500, 4200, 7500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setValorEstimado(preset)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border ${
                          valorEstimado === preset
                            ? "bg-emerald-600 text-white border-emerald-400"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        ${preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Prioridad Comercial
                    </label>
                    <select
                      value={prioridad}
                      onChange={(e) => setPrioridad(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs"
                    >
                      <option value="Alta">Alta (🔥 Lead Caliente)</option>
                      <option value="Media">Media (Interés activo)</option>
                      <option value="Baja">Baja (Largo plazo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">
                      Etapa Inicial
                    </label>
                    <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>1. NUEVO (Calificación)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              {currentUser?.rol === "ADMIN" ? (
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30">
                  <label className="text-purple-300 block mb-1.5 font-bold text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Asignar Cartera Comercial a:</span>
                  </label>
                  <select
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500 font-semibold"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.rol})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Como Administrador puedes delegar este cliente a cualquier colaborador para que lo gestione en su tablero.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                  <UserIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Este cliente ingresará en tu cartera personal (<strong>{currentUser?.nombre}</strong>).
                  </span>
                </div>
              )}

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Diagnóstico</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Crear Prospecto y Abrir Guía de Cierre</span>
                </button>
              </div>
            </div>

            {/* Step 3 Right: Road to Sale Closing Visual Funnel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Ruta de Cierre que se Activará
                    </h4>
                    <p className="text-[10px] text-emerald-300">
                      Al guardar, el sistema te guiará paso a paso en las 5 etapas:
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
                      <div>
                        <strong className="text-white block text-xs">Calificación &amp; WhatsApp</strong>
                        <span className="text-[10px] text-slate-400">Verificar decisor y enviar mensaje de bienvenida.</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold">20%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black flex items-center justify-center">2</span>
                      <div>
                        <strong className="text-slate-300 block text-xs">Diagnóstico y Relevamiento</strong>
                        <span className="text-[10px] text-slate-500">Definir dolores, pantallas y alcance técnico.</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">40%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black flex items-center justify-center">3</span>
                      <div>
                        <strong className="text-slate-300 block text-xs">Propuesta Formal CPQ</strong>
                        <span className="text-[10px] text-slate-500">Generar cotización oficial y coordinar demo.</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">60%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black flex items-center justify-center">4</span>
                      <div>
                        <strong className="text-slate-300 block text-xs">Negociación de Condiciones</strong>
                        <span className="text-[10px] text-slate-500">Superar objeciones y acordar pagos / cuotas.</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">80%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">5</span>
                      <div>
                        <strong className="text-emerald-300 block text-xs">¡Cierre Ganado! Pase a Proyecto</strong>
                        <span className="text-[10px] text-emerald-400/80">Anticipo cobrado y pase a Producción / Retainer.</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
