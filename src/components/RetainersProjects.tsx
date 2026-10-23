"use client";

import React from "react";
import { Retainer, Project } from "../types/crm";
import {
  ShieldCheck,
  Calendar,
  Layers,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface RetainersProjectsProps {
  retainers: Retainer[];
  projects: Project[];
}

export const RetainersProjects: React.FC<RetainersProjectsProps> = ({
  retainers,
  projects,
}) => {
  const totalMrr = retainers
    .filter((r) => r.estado === "ACTIVO")
    .reduce((acc, curr) => acc + curr.cuotaMensual, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Retainers / MRR metric */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              MRR Recurrente Mensual
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            ${totalMrr.toLocaleString("es-AR")} USD
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proveniente de {retainers.length} clientes con soporte web y pauta continua.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Proyectos en Producción
            </span>
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {projects.length} Activos
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Con seguimiento de hitos de diseño UX/UI y desarrollo.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Tasa de Retención
            </span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            96%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Contratos de soporte renovados en Mendoza y resto del país.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retainers Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Abonos Mensuales de Mantenimiento & Pauta
            </h3>
            <span className="text-xs text-slate-400">{retainers.length} contratos</span>
          </div>

          <div className="space-y-3">
            {retainers.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800/80">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-300">
                  Sin abonos mensuales activos
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Al cerrar un cliente con cuota recurrente de mantenimiento, hosting o pauta de anuncios, regístralo aquí para monitorear el MRR.
                </p>
              </div>
            ) : (
              retainers.map((r) => (
                <div
                  key={r.id}
                  className="glass-card p-4 rounded-xl border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.empresa}</h4>
                      <p className="text-xs text-slate-400">Contacto: {r.clienteNombre}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-400">
                        ${r.cuotaMensual} {r.moneda}/mes
                      </span>
                      <span className="text-[10px] block text-emerald-300 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mt-0.5">
                        {r.estado}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-300">{r.servicio}</span>
                    <span className="text-[11px] flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Cobro día {r.diaCobro} (Próx: {r.proximaFecha})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Seguimiento de Hitos de Proyectos Ganados
            </h3>
            <span className="text-xs text-slate-400">{projects.length} proyectos</span>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800/80">
                <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-300">
                  Sin proyectos en desarrollo actualmente
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Cuando ganes un lead en el Pipeline comercial, sus hitos de diseño (Figma) y desarrollo frontend/backend se gestionarán aquí.
                </p>
              </div>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="glass-card p-4 rounded-xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.nombre}</h4>
                      <p className="text-xs text-slate-400">Cliente: {p.cliente}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {p.faseActual}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Progreso de Entrega:</span>
                      <span className="text-slate-200 font-bold">{p.progreso}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.progreso}%` }}
                      />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Entrega: {p.fechaEntrega}
                    </span>

                    <div className="flex items-center gap-2">
                      {p.figmaUrl && (
                        <a
                          href={p.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Figma
                        </a>
                      )}
                      {p.stagingUrl && (
                        <a
                          href={p.stagingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Staging
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
