"use client";

import React, { useState } from "react";
import { Lead, LeadStatus } from "../types/crm";
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
} from "lucide-react";
import { SERVICE_LABELS } from "./PipelineKanban";

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onGoToQuote: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onGoToQuote,
}) => {
  if (!lead) return null;

  const service = SERVICE_LABELS[lead.servicioInteres];
  const cleanPhone = lead.telefono.replace(/[^0-9]/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8">
          <div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${service?.tagClass}`}>
              {service?.name || lead.servicioInteres}
            </span>
            <h3 className="text-lg font-bold text-white mt-1.5">{lead.empresa || lead.nombre}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{lead.nombre}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Origen: {lead.origen}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Presupuesto</span>
            <span className="text-lg font-extrabold text-emerald-400">
              ${lead.valorEstimado.toLocaleString("es-AR")} {lead.moneda}
            </span>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Correo Electrónico</span>
            <a
              href={`mailto:${lead.email}`}
              className="text-slate-200 hover:text-blue-400 font-medium flex items-center gap-1 mt-0.5"
            >
              <Mail className="w-3 h-3 text-slate-400" />
              {lead.email || "No registrado"}
            </a>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Teléfono / WhatsApp</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-200 font-medium">{lead.telefono || "No registrado"}</span>
              {lead.telefono && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <MessageCircle className="w-2.5 h-2.5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Notes & Requirements */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-1.5">Requerimientos y Alcance:</h4>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
            {lead.notas || "Sin notas registradas para este prospecto."}
          </div>
        </div>

        {/* Change Stage Controls */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-1.5">Cambiar Estado del Pipeline:</h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(["NUEVO", "RELEVAMIENTO", "PROPUESTA_ENVIADA", "EN_NEGOCIACION", "GANADO"] as LeadStatus[]).map(
              (status) => (
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
              )
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onGoToQuote(lead);
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/40 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Abrir en Cotizador CPQ</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
