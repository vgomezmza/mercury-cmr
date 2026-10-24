"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { PipelineKanban } from "../components/PipelineKanban";
import { SocialHub } from "../components/SocialHub";
import { QuoteCalculator } from "../components/QuoteCalculator";
import { RetainersProjects } from "../components/RetainersProjects";
import { NewLeadModal } from "../components/NewLeadModal";
import { LeadDetailModal } from "../components/LeadDetailModal";
import { ProspectsDirectory } from "../components/ProspectsDirectory";
import { ChannelSettings } from "../components/ChannelSettings";
import { OpinionsMonitor } from "../components/OpinionsMonitor";
import { LoginScreen } from "../components/LoginScreen";
import { UserManagement } from "../components/UserManagement";
import {
  INITIAL_LEADS,
  INITIAL_SOCIAL_FEED,
  INITIAL_RETAINERS,
  INITIAL_PROJECTS,
  DEFAULT_EMAIL_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
  INITIAL_OPINIONS,
  INITIAL_USERS,
} from "../data/initialData";
import {
  Lead,
  LeadStatus,
  SocialInteraction,
  EmailChannelConfig,
  SocialChannelsConfig,
  ClientOpinion,
  User,
} from "../types/crm";
import {
  Kanban,
  Building2,
  Share2,
  Calculator,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Sliders,
  Star,
  Mail,
  Users as UsersIcon,
} from "lucide-react";

export default function Home() {
  // Authentication & Users State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem("mercurycad_active_user");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        // Verify user still exists and is active
        const valid = users.find((u) => u.id === parsed.id && u.activo);
        if (valid) {
          setCurrentUser(valid);
        } else {
          localStorage.removeItem("mercurycad_active_user");
        }
      }
    } catch (e) {
      console.error("Error reading session:", e);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLogin = (user: User, remember: boolean) => {
    setCurrentUser(user);
    if (remember) {
      try {
        const { password: _, ...safeUser } = user;
        localStorage.setItem("mercurycad_active_user", JSON.stringify(safeUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        localStorage.removeItem("mercurycad_active_user");
      } catch (e) {
        console.error(e);
      }
    }
    showToast(`Bienvenido, ${user.nombre} (${user.rol})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("mercurycad_active_user");
    } catch (e) {
      console.error(e);
    }
    showToast("Sesión cerrada correctamente.");
  };

  // Main navigation tabs
  type TabType =
    | "prospects"
    | "pipeline"
    | "opinions"
    | "social"
    | "quotes"
    | "retainers"
    | "settings"
    | "users";

  const [activeTab, setActiveTab] = useState<TabType>("prospects");

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [socialFeed, setSocialFeed] = useState<SocialInteraction[]>(INITIAL_SOCIAL_FEED);
  const [retainers, setRetainers] = useState(INITIAL_RETAINERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  // Email and Channel configurations state
  const [emailConfig, setEmailConfig] = useState<EmailChannelConfig>(DEFAULT_EMAIL_CONFIG);
  const [socialConfig, setSocialConfig] = useState<SocialChannelsConfig>(DEFAULT_SOCIAL_CONFIG);
  const [opinions, setOpinions] = useState<ClientOpinion[]>(INITIAL_OPINIONS);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("TODOS");

  // Modals states
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // User management actions
  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Usuario ${newUser.nombre} registrado con éxito.`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser?.id === updatedUser.id) {
      if (!updatedUser.activo) {
        handleLogout();
        showToast("Tu cuenta ha sido deshabilitada por la Dirección.");
        return;
      }
      setCurrentUser(updatedUser);
      try {
        const { password: _, ...safeUser } = updatedUser;
        localStorage.setItem("mercurycad_active_user", JSON.stringify(safeUser));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast("Usuario eliminado del sistema.");
  };

  // Lead actions
  const handleUpdateLeadStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, estado: newStatus } : l))
    );
    showToast(`Lead actualizado a la etapa: ${newStatus.replace("_", " ")}`);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
    showToast(`Prospecto ${updatedLead.empresa} actualizado.`);
  };

  const handleSaveNewLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Nuevo lead ingresado: ${newLead.nombre} (${newLead.empresa})`);
  };

  // Social feed actions
  const handleConvertToLead = (interaction: SocialInteraction) => {
    const newLead: Lead = {
      id: `lead-conv-${Date.now()}`,
      nombre: interaction.remitente,
      empresa: interaction.handle.includes("@") ? interaction.handle : "Empresa Redes",
      email: `${interaction.handle.replace(/[@#]/g, "").toLowerCase()}@contacto.com`,
      telefono: "+54 261 400-0000",
      servicioInteres: "UX_UI",
      estado: "NUEVO",
      valorEstimado: 2500,
      moneda: "USD",
      origen:
        interaction.plataforma === "FACEBOOK"
          ? "Facebook Ads"
          : interaction.plataforma === "INSTAGRAM"
          ? "Instagram DM"
          : interaction.plataforma === "LINKEDIN"
          ? "LinkedIn"
          : "X (Twitter)",
      notas: `Lead originado de consulta en redes: "${interaction.contenido}"`,
      prioridad: interaction.sentiment === "Interés Alto" ? "Alta" : "Media",
      createdAt: "Recién ingresado",
      tiempoSinContactoHoras: 0,
    };

    setSocialFeed((prev) =>
      prev.map((s) => (s.id === interaction.id ? { ...s, leadId: newLead.id } : s))
    );

    setLeads((prev) => [newLead, ...prev]);
    setActiveTab("pipeline");
    showToast(`¡Mensaje convertido en lead exitosamente!`);
  };

  const handleSendReply = (interactionId: string, replyText: string) => {
    setSocialFeed((prev) =>
      prev.map((s) => (s.id === interactionId ? { ...s, respondido: true } : s))
    );
    showToast(`Respuesta enviada a través de la API oficial`);
  };

  // Opinion reply action
  const handleReplyOpinion = (opinionId: string, replyText: string) => {
    setOpinions((prev) =>
      prev.map((op) =>
        op.id === opinionId
          ? { ...op, estado: "RESPONDIDO", respuesta: replyText }
          : op
      )
    );
    showToast("Respuesta oficial registrada y enviada al canal del cliente.");
  };

  // If session is checking or no authenticated user, show login screen
  if (!currentUser && !isAuthChecking) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  // Filter leads by search query
  const searchedLeads = leads.filter(
    (l) =>
      l.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.origen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineUsd = leads.reduce(
    (acc, curr) => acc + (curr.valorEstimado || 0),
    0
  );
  const mrrTotalUsd = retainers.reduce((acc, curr) => acc + curr.cuotaMensual, 0);

  const pendingOpinionsCount = opinions.filter((o) => o.estado === "PENDIENTE").length;

  // Filter navigation tabs by User Role (RBAC)
  const allTabs = [
    {
      id: "prospects",
      label: "Directorio Prospectos",
      icon: Building2,
      badge: leads.length,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "pipeline",
      label: "Pipeline Kanban",
      icon: Kanban,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "opinions",
      label: "Opiniones & Reseñas",
      icon: Star,
      badge: pendingOpinionsCount,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "social",
      label: "Social Hub (Redes)",
      icon: Share2,
      badge: socialFeed.filter((s) => !s.respondido).length,
      roles: ["ADMIN", "COMERCIAL"],
    },
    {
      id: "quotes",
      label: "Cotizador CPQ",
      icon: Calculator,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "retainers",
      label: "Abonos & Proyectos",
      icon: ShieldCheck,
      badge: retainers.length,
      roles: ["ADMIN", "PROJECT_MANAGER"],
    },
    {
      id: "settings",
      label: "Configuración Canales",
      icon: Sliders,
      roles: ["ADMIN"],
    },
    {
      id: "users",
      label: "Gestión de Usuarios",
      icon: UsersIcon,
      badge: users.filter((u) => u.activo).length,
      roles: ["ADMIN"],
    },
  ];

  const visibleTabs = allTabs.filter(
    (tab) => !currentUser || tab.roles.includes(currentUser.rol)
  );

  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl glass-panel border border-cyan-500/50 shadow-2xl flex items-center gap-3 bg-slate-900/90 text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Header with User Profile Badge & Logout */}
      <Header
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        leadsCount={leads.length}
        totalPipelineUsd={totalPipelineUsd}
        mrrTotalUsd={mrrTotalUsd}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Navigation Sub-Bar */}
      <nav className="glass-panel border-b border-slate-800/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? "bg-white text-blue-700"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 pl-4">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <strong className="text-slate-300 font-semibold">{emailConfig.email}</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === "prospects" && (
          <ProspectsDirectory
            leads={searchedLeads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateLeadStatus}
            onGoToQuote={(lead) => {
              setActiveTab("quotes");
            }}
          />
        )}

        {activeTab === "pipeline" && (
          <PipelineKanban
            leads={searchedLeads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onSelectLead={(lead) => setSelectedLead(lead)}
            filterService={filterService}
            setFilterService={setFilterService}
          />
        )}

        {activeTab === "opinions" && (
          <OpinionsMonitor
            opinions={opinions}
            onReplyOpinion={handleReplyOpinion}
            onSelectLeadById={(leadId) => {
              const found = leads.find((l) => l.id === leadId);
              if (found) setSelectedLead(found);
            }}
          />
        )}

        {activeTab === "social" && (
          <SocialHub
            socialFeed={socialFeed}
            onConvertToLead={handleConvertToLead}
            onSendReply={handleSendReply}
          />
        )}

        {activeTab === "quotes" && <QuoteCalculator />}

        {activeTab === "retainers" && (
          <RetainersProjects retainers={retainers} projects={projects} />
        )}

        {activeTab === "settings" && (
          <ChannelSettings
            emailConfig={emailConfig}
            socialConfig={socialConfig}
            onSaveEmailConfig={(newCfg) => {
              setEmailConfig(newCfg);
              showToast("Configuración de correo Mercury CAD actualizada.");
            }}
            onSaveSocialConfig={(newCfg) => {
              setSocialConfig(newCfg);
              showToast("Credenciales de redes sociales actualizadas.");
            }}
          />
        )}

        {activeTab === "users" && currentUser && (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Modals */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSaveLead={handleSaveNewLead}
      />

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateLeadStatus}
        onUpdateLead={handleUpdateLead}
        onGoToQuote={(lead) => {
          setActiveTab("quotes");
        }}
      />
    </div>
  );
}
