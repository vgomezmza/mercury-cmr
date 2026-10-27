"use client";

import React, { useState } from "react";
import { SocialInteraction, SocialPlatform } from "../types/crm";
import {
  Share2,
  Send,
  MessageSquare,
  Sparkles,
  UserCheck,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

interface SocialHubProps {
  socialFeed: SocialInteraction[];
  onConvertToLead: (interaction: SocialInteraction) => void;
  onSendReply: (interactionId: string, replyText: string) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({
  socialFeed,
  onConvertToLead,
  onSendReply,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("TODAS");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [searchSocial, setSearchSocial] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleReplyChange = (id: string, text: string) => {
    setReplyTextMap((prev) => ({ ...prev, [id]: text }));
  };

  const handleSend = (id: string) => {
    const text = replyTextMap[id];
    if (!text || !text.trim()) return;
    onSendReply(id, text);
    setReplyTextMap((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const filteredFeed = socialFeed.filter((item) => {
    const matchesPlatform =
      selectedPlatform === "TODAS" || item.plataforma === selectedPlatform;
    const matchesSearch =
      item.remitente.toLowerCase().includes(searchSocial.toLowerCase()) ||
      item.contenido.toLowerCase().includes(searchSocial.toLowerCase()) ||
      item.handle.toLowerCase().includes(searchSocial.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const platformMeta: Record<
    SocialPlatform,
    { name: string; tagClass: string; iconLabel: string; borderGlow: string }
  > = {
    FACEBOOK: {
      name: "Facebook",
      tagClass: "bg-blue-600/20 text-blue-300 border-blue-500/40",
      iconLabel: "FB",
      borderGlow: "border-blue-500/30",
    },
    INSTAGRAM: {
      name: "Instagram",
      tagClass: "bg-fuchsia-600/20 text-pink-300 border-pink-500/40",
      iconLabel: "IG",
      borderGlow: "border-fuchsia-500/30",
    },
    LINKEDIN: {
      name: "LinkedIn",
      tagClass: "bg-sky-600/20 text-sky-300 border-sky-500/40",
      iconLabel: "in",
      borderGlow: "border-sky-500/30",
    },
    X_TWITTER: {
      name: "X (Twitter)",
      tagClass: "bg-slate-700/40 text-slate-200 border-slate-600/40",
      iconLabel: "𝕏",
      borderGlow: "border-slate-500/30",
    },
    WHATSAPP: {
      name: "WhatsApp",
      tagClass: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40",
      iconLabel: "WA",
      borderGlow: "border-emerald-500/30",
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Platform Status */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["FACEBOOK", "INSTAGRAM", "LINKEDIN", "X_TWITTER", "WHATSAPP"] as SocialPlatform[]).map(
          (p) => {
            const count = socialFeed.filter((s) => s.plataforma === p).length;
            const meta = platformMeta[p];
            return (
              <div
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`glass-panel p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  selectedPlatform === p
                    ? "border-blue-500 bg-blue-950/30 shadow-md shadow-blue-500/20"
                    : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {meta.iconLabel}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{meta.name}</h4>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        API Conectada
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-200">{count}</span>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 glass-panel rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedPlatform("TODAS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPlatform === "TODAS"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-400 hover:text-white bg-slate-800/40"
            }`}
          >
            Todas las Redes ({socialFeed.length})
          </button>
          {(["FACEBOOK", "INSTAGRAM", "LINKEDIN", "X_TWITTER", "WHATSAPP"] as SocialPlatform[]).map(
            (p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedPlatform === p
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400 hover:text-white bg-slate-800/40"
                }`}
              >
                {platformMeta[p].name}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar mensajes, @handle..."
              value={searchSocial}
              onChange={(e) => setSearchSocial(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Sincronizar consultas de redes sociales"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Social Feed List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFeed.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800/80">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">
              Bandeja de entrada al día
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No hay mensajes ni comentarios pendientes. Las consultas de Facebook Ads, Instagram DM, LinkedIn y X se centralizarán aquí una vez conectadas las APIs en Canales &amp; Configuración.
            </p>
          </div>
        ) : (
          filteredFeed.map((item) => {
            const meta = platformMeta[item.plataforma];
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white text-sm border border-slate-700 shadow-sm overflow-hidden">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.remitente}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.remitente.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{item.remitente}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${meta.tagClass}`}>
                          {meta.name}
                        </span>
                        {item.sentiment && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.sentiment}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.handle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.fecha}</span>
                    <button
                      onClick={() => onConvertToLead(item)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Convertir en Lead</span>
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-normal">
                  &ldquo;{item.contenido}&rdquo;
                </div>

                {/* Quick Reply Box */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Responder a ${item.remitente} por ${meta.name}...`}
                    value={replyTextMap[item.id] || ""}
                    onChange={(e) => handleReplyChange(item.id, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(item.id)}
                    className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
                  />
                  <button
                    onClick={() => handleSend(item.id)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
