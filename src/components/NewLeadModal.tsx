"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Lead, User } from "../types/crm";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead, options?: { keepOpen?: boolean }) => void;
  existingLeads?: Lead[];
  currentUser?: User | null;
  users?: User[];
  variant?: "modal" | "page";
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
  currentUser,
  variant = "modal",
}) => {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const nombreInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setNombre("");
    setEmpresa("");
    setEmail("");
    setTelefono("");
    setNotas("");
    setValidationError(null);
  };

  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      setAddedFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    setAddedFeedback(null);
    onClose();
  };

  const handleSave = (keepOpen: boolean) => {
    if (!nombre.trim() || !empresa.trim() || !email.trim() || !telefono.trim()) {
      setValidationError(
        "Completa todos los campos obligatorios marcados con * (Nombre y Apellido, Empresa, Email y Teléfono)."
      );
      return;
    }

    setValidationError(null);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      nombre: nombre.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      servicioInteres: "UX_UI",
      estado: "NUEVO",
      valorEstimado: 0,
      moneda: "USD",
      origen: "Web MercuryCAD",
      notas: notas.trim() || "Nuevo prospecto relevado.",
      prioridad: "Media",
      createdAt: "Recién ingresado",
      tiempoSinContactoHoras: 0,
      verificacionEstado: "PENDIENTE",
      creadoPorId: currentUser?.id,
      asignadoAId: currentUser?.id,
      asignadoANombre: currentUser?.nombre,
      checklistVenta: {
        contactoValidado: true,
        radarRedesRevisado: false,
        primerMensajeEnviado: false,
      },
    };

    onSaveLead(newLead, { keepOpen });

    if (keepOpen) {
      const savedCompany = empresa.trim();
      resetForm();
      setAddedFeedback(`Lead "${savedCompany}" creado. Puedes cargar el siguiente.`);
      setTimeout(() => {
        setAddedFeedback(null);
      }, 3000);
      nombreInputRef.current?.focus();
    } else {
      resetForm();
      setAddedFeedback(null);
      onClose();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(false);
  };

  const cardContent = (
    <div className="w-full max-w-[440px] bg-[#06113D] border border-[#2F4FE0] rounded-2xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.55)] animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight font-poppins">
          Crear Nuevo Lead
        </h3>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar formulario"
          className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Feedback when adding multiple consecutive leads */}
      {addedFeedback && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedFeedback}</span>
        </div>
      )}

      {/* 5-Field Single-Step Form (PDF Page 2) */}
      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="new-lead-nombre"
            className="block text-xs sm:text-sm font-normal text-[#E2E8F0] mb-1.5"
          >
            Nombre y Apellido<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            ref={nombreInputRef}
            id="new-lead-nombre"
            type="text"
            required
            placeholder="Ej. Laura Catena"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="w-full bg-[#0A1024] border border-[#2F4FE0] focus:border-[#5C7CFF] focus:ring-1 focus:ring-[#5C7CFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="new-lead-empresa"
            className="block text-xs sm:text-sm font-normal text-[#E2E8F0] mb-1.5"
          >
            Empresa<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="new-lead-empresa"
            type="text"
            required
            placeholder="Spotify"
            value={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="w-full bg-[#0A1024] border border-[#2F4FE0] focus:border-[#5C7CFF] focus:ring-1 focus:ring-[#5C7CFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="new-lead-email"
            className="block text-xs sm:text-sm font-normal text-[#E2E8F0] mb-1.5"
          >
            Email<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="new-lead-email"
            type="email"
            required
            placeholder="maria@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="w-full bg-[#0A1024] border border-[#2F4FE0] focus:border-[#5C7CFF] focus:ring-1 focus:ring-[#5C7CFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="new-lead-telefono"
            className="block text-xs sm:text-sm font-normal text-[#E2E8F0] mb-1.5"
          >
            Teléfono<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="new-lead-telefono"
            type="tel"
            required
            placeholder="Ej. +54 261 400-0000"
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="w-full bg-[#0A1024] border border-[#2F4FE0] focus:border-[#5C7CFF] focus:ring-1 focus:ring-[#5C7CFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="new-lead-notas"
            className="block text-xs sm:text-sm font-normal text-[#E2E8F0] mb-1.5"
          >
            Notas
          </label>
          <textarea
            id="new-lead-notas"
            rows={3}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full bg-[#0A1024] border border-[#2F4FE0] focus:border-[#5C7CFF] focus:ring-1 focus:ring-[#5C7CFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8] outline-none transition-all resize-none"
          />
        </div>

        {/* 3 Action Buttons (PDF Page 2) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg bg-[#5B606A] hover:bg-[#6E7480] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-[#229622] hover:bg-[#29AE29] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            Agregar Lead
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#2E5BFF] hover:bg-[#436DFF] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-center cursor-pointer"
          >
            Crear y agregar otro
          </button>
        </div>
      </form>
    </div>
  );

  if (variant === "page") {
    return (
      <div className="flex-1 flex items-center justify-center py-6 sm:py-10 px-4">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040B2A]/90 backdrop-blur-sm animate-in fade-in duration-200">
      {cardContent}
    </div>
  );
};
