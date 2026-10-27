"use client";

import React, { useState, useEffect } from "react";
import type { Lead } from "../types/crm";
import {
  Calculator,
  Layers,
  Code2,
  TrendingUp,
  ShieldCheck,
  Check,
  Download,
  Copy,
  Printer,
  FileText,
  DollarSign,
  Palette,
  Sparkles,
} from "lucide-react";

interface QuoteCalculatorProps {
  initialLead?: Lead | null;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ initialLead }) => {
  // Service configuration states
  const [clientName, setClientName] = useState(initialLead?.nombre || "");
  const [projectName, setProjectName] = useState(initialLead?.empresa || "");

  useEffect(() => {
    if (initialLead) {
      if (initialLead.nombre) setClientName(initialLead.nombre);
      if (initialLead.empresa) setProjectName(initialLead.empresa);
      if (initialLead.servicioInteres === "CUSTOM_SOFTWARE") {
        setDevType("software");
        setIncludeDev(true);
      } else if (initialLead.servicioInteres === "META_GOOGLE_ADS") {
        setIncludeAds(true);
      } else if (initialLead.servicioInteres === "MONTHLY_MAINTENANCE") {
        setIncludeMaintenance(true);
      }
    }
  }, [initialLead]);

  // UX/UI
  const [includeUxUi, setIncludeUxUi] = useState(true);
  const [screenCount, setScreenCount] = useState(12);
  const [includePrototype, setIncludePrototype] = useState(true);

  // Development
  const [includeDev, setIncludeDev] = useState(true);
  const [devType, setDevType] = useState<"landing" | "corporate" | "ecommerce" | "software">("corporate");
  const [hasAuthAndDb, setHasAuthAndDb] = useState(true);

  // Marketing & Ads
  const [includeAds, setIncludeAds] = useState(false);
  const [adBudget, setAdBudget] = useState(800);

  // Maintenance
  const [includeMaintenance, setIncludeMaintenance] = useState(false);
  const [maintenanceTier, setMaintenanceTier] = useState<"basico" | "proactivo" | "enterprise">("proactivo");

  const [copied, setCopied] = useState(false);

  // Calculations
  const uxUiTotal = includeUxUi ? screenCount * 120 + (includePrototype ? 450 : 0) : 0;

  const devBaseMap = {
    landing: 650,
    corporate: 1600,
    ecommerce: 2800,
    software: 4500,
  };
  const devTotal = includeDev ? devBaseMap[devType] + (hasAuthAndDb ? 750 : 0) : 0;

  const adsSetupFee = 350;
  const adsManagementFee = adBudget * 0.15;
  const adsTotal = includeAds ? adsSetupFee + adsManagementFee : 0;

  const maintenanceMap = {
    basico: 250,
    proactivo: 450,
    enterprise: 850,
  };
  const maintenanceTotal = includeMaintenance ? maintenanceMap[maintenanceTier] : 0;

  const grandTotal = uxUiTotal + devTotal + adsTotal;
  const recurringTotal = maintenanceTotal;

  const handleCopyProposal = () => {
    const summary = `
=============================================
PROPUESTA ECONÓMICA - MERCURY CREATION & DESIGN
Cliente: ${clientName || "Estimado Cliente"}
Proyecto: ${projectName || "Solución Digital Integral"}
=============================================
Servicios Incluidos:
${includeUxUi ? `• Diseño UX/UI (${screenCount} pantallas + Prototipo Figma): $${uxUiTotal} USD` : ""}
${includeDev ? `• Desarrollo (${devType.toUpperCase()} + APIs/DB): $${devTotal} USD` : ""}
${includeAds ? `• Campañas Ads (Setup + Gestión 15%): $${adsTotal.toFixed(0)} USD` : ""}
---------------------------------------------
TOTAL PROYECTO INICIAL: $${grandTotal.toLocaleString("es-AR")} USD
${includeMaintenance ? `ABONO MENSUAL MANTENIMIENTO (${maintenanceTier.toUpperCase()}): $${maintenanceTotal} USD/mes` : ""}
=============================================
Mercury Creation & Design • Mendoza, Argentina
www.mercurycad.com.ar • info@mercurycad.com.ar
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 glass-panel rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            Cotizador Inteligente CPQ para Servicios de Agencia
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calcula presupuestos a medida según horas de UX/UI, desarrollo web, pauta de ads y abono de soporte.
          </p>
        </div>

        <button
          onClick={handleCopyProposal}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>¡Copiado al Portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar Resumen de Propuesta</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Configuration Column (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client & Project Info */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Datos del Prospecto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nombre o Empresa del Cliente</label>
                <input
                  type="text"
                  placeholder="ej. Bodega Alturas de Mendoza"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  placeholder="ej. Rediseño UX/UI y Web App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Module 1: Diseño UX/UI */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUxUi}
                  onChange={(e) => setIncludeUxUi(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-purple-400" />
                  Diseño UX/UI & Prototipado Figma
                </span>
              </label>
              <span className="text-xs font-bold text-purple-300">
                ${uxUiTotal.toLocaleString("es-AR")} USD
              </span>
            </div>

            {includeUxUi && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-300 font-medium">Cantidad de Pantallas / Flujos:</span>
                    <p className="text-[11px] text-slate-500">Base: $120 USD por pantalla diseñada y documentada.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={screenCount}
                      onChange={(e) => setScreenCount(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white text-center outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includePrototype}
                    onChange={(e) => setIncludePrototype(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Incluir Prototipo Interactivo Clickable en Figma con micro-animaciones (+$450 USD)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Module 2: Desarrollo Web / Software */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDev}
                  onChange={(e) => setIncludeDev(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Desarrollo Web & Software a Medida
                </span>
              </label>
              <span className="text-xs font-bold text-blue-300">
                ${devTotal.toLocaleString("es-AR")} USD
              </span>
            </div>

            {includeDev && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Tipo de Solución Tecnológica:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "landing", label: "Landing Page ($650)" },
                      { id: "corporate", label: "Web Corporativa ($1.600)" },
                      { id: "ecommerce", label: "E-Commerce ($2.800)" },
                      { id: "software", label: "Software / SaaS ($4.500)" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDevType(item.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                          devType === item.id
                            ? "bg-blue-600/30 border-blue-500 text-white shadow-sm"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={hasAuthAndDb}
                    onChange={(e) => setHasAuthAndDb(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Incluir Arquitectura Backend, Base de Datos PostgreSQL y Sistema de Autenticación (+$750 USD)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Module 3: Ads & Mantenimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Meta & Google Ads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAds}
                    onChange={(e) => setIncludeAds(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    Google & Meta Ads
                  </span>
                </label>
                <span className="text-xs font-bold text-amber-300">
                  ${adsTotal.toFixed(0)} USD
                </span>
              </div>

              {includeAds && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <p>Setup de Pixel / Conversiones: $350 USD</p>
                  <div className="flex items-center justify-between pt-1">
                    <span>Inversión Pauta estimada:</span>
                    <input
                      type="number"
                      step={100}
                      value={adBudget}
                      onChange={(e) => setAdBudget(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white text-right outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Fee de gestión mensual: 15% (${adsManagementFee.toFixed(0)} USD)
                  </p>
                </div>
              )}
            </div>

            {/* Mantenimiento Web Mensual */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMaintenance}
                    onChange={(e) => setIncludeMaintenance(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Abono Mantenimiento
                  </span>
                </label>
                <span className="text-xs font-bold text-emerald-300">
                  ${maintenanceTotal} USD/mes
                </span>
              </div>

              {includeMaintenance && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "basico", label: "Básico ($250)" },
                      { id: "proactivo", label: "Pro ($450)" },
                      { id: "enterprise", label: "VIP ($850)" },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setMaintenanceTier(tier.id as any)}
                        className={`p-1.5 rounded-lg text-[10px] font-medium border text-center transition-all ${
                          maintenanceTier === tier.id
                            ? "bg-emerald-600/30 border-emerald-500 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Incluye copias de seguridad diarias, SLA de respuesta en 2h y soporte continuo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Proposal Summary Card (1 span) */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 shadow-xl shadow-blue-900/20 space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                Resumen Ejecutivo
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Mercury CAD
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                {projectName || "Solución Digital Integral"}
              </h4>
              <p className="text-xs text-slate-400">
                Para: {clientName || "Cliente Prospecto"}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              {includeUxUi && (
                <div className="flex justify-between">
                  <span>Diseño UX/UI ({screenCount} pantallas)</span>
                  <span className="font-semibold text-white">${uxUiTotal} USD</span>
                </div>
              )}
              {includeDev && (
                <div className="flex justify-between">
                  <span>Desarrollo ({devType.toUpperCase()})</span>
                  <span className="font-semibold text-white">${devTotal} USD</span>
                </div>
              )}
              {includeAds && (
                <div className="flex justify-between">
                  <span>Ads (Setup + Pauta)</span>
                  <span className="font-semibold text-white">${adsTotal.toFixed(0)} USD</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Proyecto (Pago Único):</span>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                ${grandTotal.toLocaleString("es-AR")} USD
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Aprox. ${(grandTotal * 1250).toLocaleString("es-AR")} ARS (TC Referencia)
              </p>
            </div>

            {includeMaintenance && (
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  Ingreso Recurrente Mensual (MRR):
                </span>
                <span className="text-lg font-bold text-emerald-300">
                  +${recurringTotal} USD / mes
                </span>
              </div>
            )}

            <button
              onClick={handleCopyProposal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generar Documento de Propuesta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
