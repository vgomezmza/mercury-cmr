"use client";

import React from "react";
import { SocialInteraction, Lead } from "../types/crm";
import {
  X,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface SocialSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (interaction: SocialInteraction, lead?: Lead) => void;
}

export const SocialSimulatorModal: React.FC<SocialSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulate,
}) => {
  if (!isOpen) return null;

  const handleSimulateFacebook = () => {
    const id = `fb-${Date.now()}`;
    const interaction: SocialInteraction = {
      id,
      plataforma: "FACEBOOK",
      remitente: "Nicolás Brizuela (Formulario Meta Ads)",
      handle: "Campaña: Software para Pymes",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      contenido: "Completó formulario de cliente potencial. Empresa: 'Transportes Cuyanos'. Presupuesto: $5.000 USD. Quiere demo de sistema de logística.",
      fecha: "Recién ingresado",
      respondido: false,
      sentiment: "Interés Alto",
    };

    const lead: Lead = {
      id: `lead-sim-${Date.now()}`,
      nombre: "Nicolás Brizuela",
      empresa: "Transportes Cuyanos",
      email: "nbrizuela@transportescuyanos.com.ar",
      telefono: "+54 261 498-7711",
      servicioInteres: "CUSTOM_SOFTWARE",
      estado: "NUEVO",
      valorEstimado: 5000,
      moneda: "USD",
      origen: "Facebook Ads",
      notas: "Generado automáticamente por webhook de Meta Lead Ads. Solicita presupuesto de desarrollo a medida.",
      prioridad: "Alta",
      createdAt: "Recién",
      tiempoSinContactoHoras: 0,
    };

    onSimulate(interaction, lead);
    onClose();
  };

  const handleSimulateInstagram = () => {
    const id = `ig-${Date.now()}`;
    const interaction: SocialInteraction = {
      id,
      plataforma: "INSTAGRAM",
      remitente: "Paula Montenegro",
      handle: "@paula_montenegro_mza",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      contenido: "¡Hola Mercury! Nos encantó el diseño de marca y UX que hicieron para la bodega. ¿Cuánto cuesta aproximadamente el diseño de identidad y landing page para un hotel boutique en Chacras de Coria?",
      fecha: "Recién ingresado",
      respondido: false,
      sentiment: "Interés Alto",
    };

    const lead: Lead = {
      id: `lead-sim-${Date.now()}`,
      nombre: "Paula Montenegro",
      empresa: "Hotel Boutique Chacras",
      email: "paula@hotelchacras.com",
      telefono: "+54 261 633-2211",
      servicioInteres: "UX_UI",
      estado: "NUEVO",
      valorEstimado: 2200,
      moneda: "USD",
      origen: "Instagram DM",
      notas: "Consulta recibida por Instagram DM. Interés en diseño UX/UI e identidad visual para hotelería.",
      prioridad: "Alta",
      createdAt: "Recién",
      tiempoSinContactoHoras: 0,
    };

    onSimulate(interaction, lead);
    onClose();
  };

  const handleSimulateLinkedIn = () => {
    const id = `li-${Date.now()}`;
    const interaction: SocialInteraction = {
      id,
      plataforma: "LINKEDIN",
      remitente: "Martín Echeverría",
      handle: "CTO @ Fintech Soluciones",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      contenido: "Estimados, vimos sus casos de éxito en desarrollo de software web. Estamos evaluando tercerizar el desarrollo de nuestro módulo de cobros recurrentes. ¿Tienen disponibilidad este mes?",
      fecha: "Recién ingresado",
      respondido: false,
      sentiment: "Interés Alto",
    };

    const lead: Lead = {
      id: `lead-sim-${Date.now()}`,
      nombre: "Martín Echeverría",
      empresa: "Fintech Soluciones",
      email: "mecheverria@fintechsol.io",
      telefono: "+54 11 5566-7788",
      servicioInteres: "CUSTOM_SOFTWARE",
      estado: "NUEVO",
      valorEstimado: 7500,
      moneda: "USD",
      origen: "LinkedIn",
      notas: "Prospección B2B vía LinkedIn. CTO buscando equipo de desarrollo especializado para módulo fintech.",
      prioridad: "Alta",
      createdAt: "Recién",
      tiempoSinContactoHoras: 0,
    };

    onSimulate(interaction, lead);
    onClose();
  };

  const handleSimulateX = () => {
    const id = `x-${Date.now()}`;
    const interaction: SocialInteraction = {
      id,
      plataforma: "X_TWITTER",
      remitente: "Marcos V.",
      handle: "@marcos_techlead",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      contenido: "Alguien conoce una agencia seria de Mendoza o Buenos Aires que arme dashboards en tiempo real y desarrolle sistemas web modernos? cc @mercurycreationandesign",
      fecha: "Recién ingresado",
      respondido: false,
      sentiment: "Interés Alto",
    };

    const lead: Lead = {
      id: `lead-sim-${Date.now()}`,
      nombre: "Marcos Villar",
      empresa: "DataVillar Analytics",
      email: "marcos@datavillar.tech",
      telefono: "+54 9 261 411-2299",
      servicioInteres: "WEB_DEVELOPMENT",
      estado: "NUEVO",
      valorEstimado: 3800,
      moneda: "USD",
      origen: "X (Twitter)",
      notas: "Capturado por monitor de menciones y palabras clave en X (Twitter).",
      prioridad: "Media",
      createdAt: "Recién",
      tiempoSinContactoHoras: 0,
    };

    onSimulate(interaction, lead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulador de Webhooks y APIs</h3>
            <p className="text-xs text-slate-400">
              Prueba la ingesta inmediata de consultas en vivo.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          Haz clic en cualquiera de los canales para simular que un cliente potencial envía un formulario o mensaje en tiempo real:
        </p>

        <div className="space-y-2.5">
          <button
            onClick={handleSimulateFacebook}
            className="w-full p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                FB
              </span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-300">
                  Simular Formulario Meta Lead Ads
                </h4>
                <p className="text-[11px] text-slate-400">
                  Nicolás Brizuela (Transportes Cuyanos) • $5.000 USD
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleSimulateInstagram}
            className="w-full p-3 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                IG
              </span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-pink-300">
                  Simular Mensaje Directo Instagram (DM)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Paula Montenegro (Hotel Boutique) • UX/UI
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-pink-400 opacity-60 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleSimulateLinkedIn}
            className="w-full p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white text-xs font-bold">
                in
              </span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300">
                  Simular Mensaje B2B de LinkedIn InMail
                </h4>
                <p className="text-[11px] text-slate-400">
                  Martín Echeverría (Fintech Soluciones) • $7.500 USD
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-sky-400 opacity-60 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleSimulateX}
            className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                𝕏
              </span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-slate-200">
                  Simular Mención Pública en X (Twitter)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Marcos Villar (DataVillar) • Desarrollo Web
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};
