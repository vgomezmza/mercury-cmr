"use client";

import React, { useState } from "react";
import { ClientOpinion } from "../types/crm";
import {
  Star,
  MessageSquare,
  Mail,
  Share2,
  Globe,
  Radio,
  Send,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";

interface OpinionsMonitorProps {
  opinions: ClientOpinion[];
  onReplyOpinion: (id: string, reply: string) => void;
  onSelectLeadById?: (leadId: string) => void;
}

export const OpinionsMonitor: React.FC<OpinionsMonitorProps> = ({
  opinions,
  onReplyOpinion,
  onSelectLeadById,
}) => {
  const [selectedCanal, setSelectedCanal] = useState<string>("TODOS");
  const [selectedSentimiento, setSelectedSentimiento] = useState<string>("TODOS");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const handleReplyChange = (id: string, text: string) => {
    setReplyTextMap((prev) => ({ ...prev, [id]: text }));
  };

  const handleSend = (id: string) => {
    const text = replyTextMap[id];
    if (!text || !text.trim()) return;
    onReplyOpinion(id, text);
    setReplyTextMap((prev) => ({ ...prev, [id]: "" }));
  };

  const filtered = opinions.filter((op) => {
    const matchCanal = selectedCanal === "TODOS" || op.canal === selectedCanal;
    const matchSentimiento =
      selectedSentimiento === "TODOS" || op.sentimiento === selectedSentimiento;
    const matchSearch =
      op.autor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.empresa && op.empresa.toLowerCase().includes(searchQuery.toLowerCase())) ||
      op.contenido.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCanal && matchSentimiento && matchSearch;
  });

  const canalMeta: Record<
    string,
    { label: string; tagClass: string; iconLabel: string }
  > = {
    EMAIL: {
      label: "Correo Oficial (info@mercurycad)",
      tagClass: "bg-blue-600/20 text-blue-300 border-blue-500/40",
      iconLabel: "Mail",
    },
    GOOGLE_REVIEWS: {
      label: "Google Reviews",
      tagClass: "bg-amber-600/20 text-amber-300 border-amber-500/40",
      iconLabel: "G",
    },
    INSTAGRAM: {
      label: "Instagram @mercurycreationandesign",
      tagClass: "bg-pink-600/20 text-pink-300 border-pink-500/40",
      iconLabel: "IG",
    },
    LINKEDIN: {
      label: "LinkedIn Recomendaciones",
      tagClass: "bg-sky-600/20 text-sky-300 border-sky-500/40",
      iconLabel: "in",
    },
    X_TWITTER: {
      label: "X (Twitter) Menciones",
      tagClass: "bg-slate-700/40 text-slate-200 border-slate-600/40",
      iconLabel: "𝕏",
    },
  };

  const rated = opinions.filter((o) => o.calificacion !== undefined);
  const avgRating =
    rated.length > 0
      ? (
          rated.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) /
          rated.length
        ).toFixed(1)
      : "—";
  const positiveCount = opinions.filter(
    (o) =>
      o.sentimiento === "Excelente / Muy Satisfecho" ||
      o.sentimiento === "Positivo"
  ).length;
  const positivePct =
    opinions.length > 0
      ? `${Math.round((positiveCount / opinions.length) * 100)}%`
      : "—";

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase">
            <span>Satisfacción de Clientes</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{avgRating} / 5.0</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {rated.length > 0 ? "Basado en opiniones verificadas" : "A la espera de primeras reseñas"}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold uppercase">
            <span>Total Opiniones Relevadas</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{opinions.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Clientes y prospectos en seguimiento activo.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase">
            <span>Sentimiento Positivo</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{positivePct}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Valoraciones excelentes sobre UX/UI y Software.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase">
            <span>Canales Conectados</span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">5 Fuentes</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Email, Google, Instagram, LinkedIn y X.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa u opinión..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCanal}
            onChange={(e) => setSelectedCanal(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos los Canales</option>
            <option value="EMAIL">Correo Oficial (info@mercurycad)</option>
            <option value="GOOGLE_REVIEWS">Google Reviews</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="X_TWITTER">X (Twitter)</option>
          </select>

          <select
            value={selectedSentimiento}
            onChange={(e) => setSelectedSentimiento(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="TODOS">Todos los Sentimientos</option>
            <option value="Excelente / Muy Satisfecho">Excelente / Muy Satisfecho</option>
            <option value="Positivo">Positivo</option>
            <option value="Oportunidad de Mejora / Crítica">Oportunidad de Mejora / Crítica</option>
          </select>
        </div>
      </div>

      {/* Opinions Cards Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800/80">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">
              No hay opiniones registradas aún
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Las reseñas de Google Reviews, comentarios en redes sociales o valoraciones recibidas por email oficial se sincronizarán aquí para su respuesta y seguimiento.
            </p>
          </div>
        ) : (
          filtered.map((op) => {
            const canal = canalMeta[op.canal] || {
              label: op.canal,
              tagClass: "bg-slate-800 text-slate-300",
              iconLabel: "OP",
            };

            const isPending = op.estado === "PENDIENTE";

            return (
              <div
                key={op.id}
                className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3.5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-sm border border-slate-700 overflow-hidden shadow-sm">
                      {op.avatarUrl ? (
                        <img
                          src={op.avatarUrl}
                          alt={op.autor}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        op.autor.charAt(0)
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{op.autor}</h4>
                        {op.empresa && (
                          <span className="text-xs font-semibold text-slate-400">
                            • {op.empresa}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${canal.tagClass}`}>
                          {canal.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        {op.calificacion && (
                          <div className="flex text-amber-400">
                            {[...Array(op.calificacion)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                            op.sentimiento.includes("Excelente")
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : op.sentimiento.includes("Crítica")
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {op.sentimiento}
                        </span>
                        <span className="text-[10px] text-slate-500">• {op.fecha}</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Lead Link */}
                  {op.leadRelacionadoId && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/40 px-3 py-1 rounded-xl border border-blue-500/30">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="font-semibold">{op.leadRelacionadoNombre}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-normal">
                  &ldquo;{op.contenido}&rdquo;
                </div>

                {/* Response thread if already replied */}
                {op.respuesta && (
                  <div className="ml-4 pl-3.5 border-l-2 border-emerald-500/60 bg-emerald-950/20 p-2.5 rounded-r-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block">
                      Respuesta oficial de Mercury Creation & Design:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {op.respuesta}
                    </p>
                  </div>
                )}

                {/* Reply box if pending */}
                {isPending && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder={`Escribir respuesta oficial de Mercury CAD para ${op.autor}...`}
                      value={replyTextMap[op.id] || ""}
                      onChange={(e) => handleReplyChange(op.id, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend(op.id)}
                      className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
                    />
                    <button
                      onClick={() => handleSend(op.id)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Responder</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
