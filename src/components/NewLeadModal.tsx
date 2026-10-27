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
  User as UserIcon,
  Shield,
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

  useEffect(() => {
    if (currentUser) {
      setAssignedUserId(currentUser.id);
    }
  }, [currentUser, isOpen]);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() && !empresa.trim()) return;

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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Carga Inteligente de Nuevo Prospecto
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                Radar Social Activo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Escribe la empresa o el directivo: el sistema buscará perfiles en LinkedIn, redes y dominios en tiempo real para que los verifiques con 1 clic.
            </p>
          </div>
        </div>

        {/* Feedback pill */}
        {copiedNotification && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Data Entry Form (5 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-3.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  Identificación del Cliente
                </span>
                <span className="text-[10px] text-slate-500">* Campos obligatorios</span>
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
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-medium"
                  />
                  {empresa && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400 font-mono">
                      Auditando...
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
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-medium"
                  />
                  {nombre && (
                    <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Vías de Comunicación
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="contacto@empresa.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+54 261 4..."
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Servicio de Interés
                </label>
                <select
                  value={servicioInteres}
                  onChange={(e) => setServicioInteres(e.target.value as ServiceType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  {Object.entries(SERVICE_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Canal de Captación
                </label>
                <select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram DM">Instagram DM</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                  <option value="Web MercuryCAD">Web MercuryCAD</option>
                  <option value="Referido">Referido</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Presupuesto Estimado (USD)
                </label>
                <input
                  type="number"
                  step={100}
                  value={valorEstimado}
                  onChange={(e) => setValorEstimado(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Prioridad Comercial
                </label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                Notas Comerciales &amp; Diagnóstico Inicial
              </label>
              <textarea
                rows={3}
                placeholder="Requerimientos, dolores del cliente o perfil de red social..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 leading-relaxed font-normal"
              />
            </div>

            {/* Assignment Section */}
            {currentUser?.rol === "ADMIN" ? (
              <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30">
                <label className="text-purple-300 block mb-1 font-bold text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Asignar / Ceder este cliente a:</span>
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500 font-semibold"
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
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <UserIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  Este cliente se registrará como <strong>propio</strong> en tu cartera ({currentUser?.nombre}).
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Guardar Prospecto</span>
              </button>
            </div>
          </form>

          {/* RIGHT COLUMN: Live Social & Web Scout Radar (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Radar Panel Container */}
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
                      Toca cualquier cuenta para abrirla y verificar si es la persona que buscas.
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

              {/* State 1: Nothing entered yet */}
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
                      Escribe el nombre de un cliente potencial en el formulario de la izquierda. El sistema generará enlaces directos a sus perfiles en LinkedIn, Instagram, dominios web y registros de CUIT.
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

              {/* State 2: Suggestions Active */}
              {suggestions && (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  {/* Duplicate Alert Card (if any) */}
                  {potentialDuplicates.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>¡Coincidencia detectada en el CRM! ({potentialDuplicates.length})</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        Ya existe un prospecto registrado con nombre similar. Evita duplicarlo revisando su registro:
                      </p>
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

                  {/* Section: Social Profiles */}
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
                          title="Abrir la página de la empresa en LinkedIn para verificarla"
                        >
                          <span>Abrir Perfil</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={handleLinkLinkedIn}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-sky-900/60 text-sky-300 border border-sky-500/30 text-[10px] font-semibold transition-all"
                          title="Vincular como canal de origen en el formulario"
                        >
                          ✓ Vincular
                        </button>
                      </div>
                    </div>

                    {/* LinkedIn Person / Executive Search */}
                    {nombre.trim() && (
                      <div className="p-2.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 hover:border-blue-400/60 transition-all flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                            👤
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              Verificar Decisor en LinkedIn
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              Buscar perfil de {nombre} en {empresa || "empresa"}
                            </div>
                          </div>
                        </div>

                        <a
                          href={suggestions.linkedinPersonUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shrink-0 shadow-sm"
                          title="Abrir búsqueda en LinkedIn para ver si este directivo sigue en el puesto"
                        >
                          <span>Buscar Persona</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

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
                          title="Abrir Instagram para ver publicaciones y autenticidad"
                        >
                          <span>Abrir Perfil</span>
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

                  {/* Section: Official Website & Domains */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Sitio Web Oficial &amp; Dominios Sugeridos
                    </span>

                    <div className="p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white font-mono">
                            https://{suggestions.candidateDomains[0]}
                          </span>
                        </div>
                        <a
                          href={suggestions.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm"
                          title="Comprobar si el sitio web está activo"
                        >
                          <span>Visitar Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-emerald-500/20">
                        <span className="text-[10px] text-slate-400">Aplicar dominio a correo:</span>
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

                  {/* Section: Web Search & AFIP CUIT */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Búsqueda en Internet &amp; Registro Legal
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={suggestions.googleSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-cyan-400" />
                          <div className="text-left">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                              Buscar en Google
                            </div>
                            <div className="text-[10px] text-slate-400">Noticias y actividad</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                      </a>

                      <a
                        href={suggestions.cuitSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          <div className="text-left">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">
                              Constatar CUIT
                            </div>
                            <div className="text-[10px] text-slate-400">AFIP &amp; Boletín Mendoza</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
