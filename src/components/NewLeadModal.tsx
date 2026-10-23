"use client";

import React, { useState } from "react";
import { Lead, ServiceType } from "../types/crm";
import { X, UserPlus, DollarSign, Sparkles } from "lucide-react";
import { SERVICE_LABELS } from "./PipelineKanban";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
}) => {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicioInteres, setServicioInteres] = useState<ServiceType>("UX_UI");
  const [valorEstimado, setValorEstimado] = useState<number>(2000);
  const [origen, setOrigen] = useState<Lead["origen"]>("Web MercuryCAD");
  const [notas, setNotas] = useState("");
  const [prioridad, setPrioridad] = useState<"Alta" | "Media" | "Baja">("Alta");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      nombre,
      empresa,
      email,
      telefono,
      servicioInteres,
      estado: "NUEVO",
      valorEstimado,
      moneda: "USD",
      origen,
      notas,
      prioridad,
      createdAt: "Recién ingresado",
      tiempoSinContactoHoras: 0,
    };

    onSaveLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Registrar Nuevo Prospecto</h3>
            <p className="text-xs text-slate-400">
              Ingresa los datos del cliente para sumarlo al embudo comercial.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Nombre y Apellido *</label>
              <input
                required
                type="text"
                placeholder="ej. Julieta Rossi"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Empresa / Organización</label>
              <input
                type="text"
                placeholder="ej. Finanzas Andinas S.A."
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="contacto@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Teléfono / WhatsApp</label>
              <input
                type="tel"
                placeholder="+54 261 4..."
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Servicio de Interés</label>
              <select
                value={servicioInteres}
                onChange={(e) => setServicioInteres(e.target.value as ServiceType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                {Object.entries(SERVICE_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Canal de Origen</label>
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Instagram DM">Instagram DM</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Web MercuryCAD">Web MercuryCAD</option>
                <option value="Referido">Referido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Presupuesto Estimado (USD)</label>
              <input
                type="number"
                step={100}
                value={valorEstimado}
                onChange={(e) => setValorEstimado(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Prioridad</label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Requerimientos o Notas Iniciales</label>
            <textarea
              rows={3}
              placeholder="Detalles sobre lo que necesita el cliente..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              Guardar en Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
