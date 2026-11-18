"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Dashboard } from "../components/Dashboard";
import { getAssetPath } from "../lib/basePath";
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
import { SERVICE_LABELS } from "../components/PipelineKanban";
import type {
  Lead,
  LeadStatus,
  SocialInteraction,
  EmailChannelConfig,
  SocialChannelsConfig,
  ClientOpinion,
  User,
  Project,
  Retainer,
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
  LayoutDashboard,
  Plus,
} from "lucide-react";

export default function Home() {
  // Authentication & Users State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check saved session and configurations on mount
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

      const savedSocial = localStorage.getItem("mercurycad_social_config");
      if (savedSocial) {
        try {
          setSocialConfig(JSON.parse(savedSocial));
        } catch (e) {
          console.error("Error parsing saved social config:", e);
        }
      }

      const savedEmail = localStorage.getItem("mercurycad_email_config");
      if (savedEmail) {
        try {
          setEmailConfig(JSON.parse(savedEmail));
        } catch (e) {
          console.error("Error parsing saved email config:", e);
        }
      }

      const savedLeads = localStorage.getItem("mercurycad_leads_db");
      if (savedLeads) {
        try {
          setLeads(JSON.parse(savedLeads));
        } catch (e) {
          console.error("Error parsing saved leads db:", e);
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
    | "dashboard"
    | "prospects"
    | "pipeline"
    | "opinions"
    | "social"
    | "quotes"
    | "retainers"
    | "settings"
    | "users";

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [adminFilterUserId, setAdminFilterUserId] = useState<string>("ALL");

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
  const [selectedLeadTab, setSelectedLeadTab] = useState<"guide" | "info" | "verify" | "edit">("guide");
  const [activeQuoteLead, setActiveQuoteLead] = useState<Lead | null>(null);

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

  // Helper to persist leads to localStorage
  const updateAndPersistLeads = (updater: Lead[] | ((prev: Lead[]) => Lead[])) => {
    setLeads((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("mercurycad_leads_db", JSON.stringify(next));
      } catch (e) {
        console.error("Error saving leads to localStorage:", e);
      }
      return next;
    });
  };

  // Lead actions
  const handleUpdateLeadStatus = (id: string, newStatus: LeadStatus) => {
    updateAndPersistLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, estado: newStatus } : l))
    );
    showToast(`Lead actualizado a la etapa: ${newStatus.replace("_", " ")}`);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    updateAndPersistLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
    showToast(`Prospecto ${updatedLead.empresa} actualizado.`);
  };

  const handleSaveNewLead = (newLead: Lead, options?: { keepOpen?: boolean }) => {
    updateAndPersistLeads((prev) => [newLead, ...prev]);
    if (options?.keepOpen) {
      showToast(`Lead "${newLead.empresa}" creado. Puedes cargar el siguiente.`);
    } else {
      setIsNewLeadOpen(false);
      showToast(`¡Lead "${newLead.empresa}" agregado exitosamente!`);
    }
  };

  const handleCreateProjectFromLead = (lead: Lead) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      nombre: `Desarrollo ${SERVICE_LABELS[lead.servicioInteres]?.name || lead.servicioInteres}`,
      cliente: lead.empresa || lead.nombre,
      faseActual: "Wireframes",
      progreso: 10,
      fechaEntrega: "A definir (30 días)",
    };
    setProjects((prev) => [newProject, ...prev]);
    setSelectedLead(null);
    setActiveTab("retainers");
    showToast(`¡Proyecto creado para ${lead.empresa}! Derivado al equipo de producción.`);
  };

  const handleCreateRetainerFromLead = (lead: Lead) => {
    const newRetainer: Retainer = {
      id: `ret-${Date.now()}`,
      clienteNombre: lead.nombre,
      empresa: lead.empresa,
      servicio: SERVICE_LABELS[lead.servicioInteres]?.name || "Mantenimiento Proactivo",
      cuotaMensual: lead.valorEstimado > 0 ? Math.round(lead.valorEstimado * 0.2) : 500,
      moneda: lead.moneda,
      diaCobro: 5,
      proximaFecha: "10 del próximo mes",
      estado: "ACTIVO",
    };
    setRetainers((prev) => [newRetainer, ...prev]);
    setSelectedLead(null);
    setActiveTab("retainers");
    showToast(`¡Abono mensual registrado para ${lead.empresa}!`);
  };

  const handleAssignLead = (leadId: string, assignedUserId: string, assignedUserName: string) => {
    updateAndPersistLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              asignadoAId: assignedUserId || undefined,
              asignadoANombre: assignedUserName !== "Sin Asignar" ? assignedUserName : undefined,
            }
          : l
      )
    );
    showToast(`Cliente asignado a ${assignedUserName}.`);
  };

  // Channel and social configs persistence handlers
  const handleSaveEmailConfig = (newCfg: EmailChannelConfig) => {
    setEmailConfig(newCfg);
    try {
      localStorage.setItem("mercurycad_email_config", JSON.stringify(newCfg));
    } catch (e) {
      console.error("Error saving email config:", e);
    }
    showToast("Configuración de correo Mercury CAD actualizada.");
  };

  const handleSaveSocialConfig = (newCfg: SocialChannelsConfig) => {
    setSocialConfig(newCfg);
    try {
      localStorage.setItem("mercurycad_social_config", JSON.stringify(newCfg));
    } catch (e) {
      console.error("Error saving social config:", e);
    }
    showToast("Credenciales de redes sociales y canales actualizadas.");
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

  // Filter leads visible to the user based on RBAC & assignment (Declared before early returns to preserve hook call order)
  const visibleLeadsForUser = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.rol === "ADMIN") {
      if (adminFilterUserId === "ALL") return leads;
      if (adminFilterUserId === "UNASSIGNED") return leads.filter((l) => !l.asignadoAId);
      return leads.filter((l) => l.asignadoAId === adminFilterUserId);
    }
    // Commercial and PM: only their own created or assigned to them
    return leads.filter(
      (l) => l.asignadoAId === currentUser.id || l.creadoPorId === currentUser.id
    );
  }, [leads, currentUser, adminFilterUserId]);

  // Filter leads by search query
  const searchedLeads = useMemo(() => {
    return visibleLeadsForUser.filter(
      (l) =>
        l.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.origen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.notas.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [visibleLeadsForUser, searchQuery]);

  const totalPipelineUsd = useMemo(() => {
    return visibleLeadsForUser.reduce(
      (acc, curr) => acc + (curr.valorEstimado || 0),
      0
    );
  }, [visibleLeadsForUser]);

  // If session is checking, show smooth branded loader
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#030212] flex flex-col items-center justify-center gap-3 fondo-espacial">
        <div className="w-10 h-10 border-2 border-[#375EFB] border-t-transparent rounded-full animate-spin shadow-lg shadow-[#375EFB]/30" />
        <span className="text-xs text-[#C0C1E6] font-medium font-poppins">Iniciando Mercury CRM...</span>
      </div>
    );
  }

  // If no authenticated user, show login screen
  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  const mrrTotalUsd = retainers.reduce((acc, curr) => acc + curr.cuotaMensual, 0);

  const pendingOpinionsCount = opinions.filter((o) => o.estado === "PENDIENTE").length;

  // Filter navigation tabs by User Role (RBAC)
  const allTabs = [
    {
      id: "dashboard",
      label: "Inicio / Tablero",
      icon: LayoutDashboard,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "prospects",
      label: currentUser?.rol === "ADMIN" ? "Directorio Prospectos" : "Mis Clientes",
      icon: Building2,
      badge: visibleLeadsForUser.length,
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
    },
    {
      id: "pipeline",
      label: currentUser?.rol === "ADMIN" ? "Pipeline Kanban" : "Mi Pipeline",
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
      label: "Social Hub",
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
      roles: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
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

      {/* Main Header (PDF Redesign) */}
      <Header
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        onOpenUsers={() => {
          setIsNewLeadOpen(false);
          setActiveTab("users");
        }}
        onGoHome={() => {
          setIsNewLeadOpen(false);
          setActiveTab("dashboard");
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        leadsCount={leads.length}
        totalPipelineUsd={totalPipelineUsd}
        mrrTotalUsd={mrrTotalUsd}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Minimalist Navigation Sub-Bar (Hidden in full-focus Crear Nuevo Lead view) */}
      {!isNewLeadOpen && (
        <nav className="bg-[#040B2A] border-b border-[#1E338A]/60 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#2E5BFF] text-white shadow-sm"
                        : "text-[#94A3B8] hover:text-white hover:bg-[#0B174A]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#0B174A] text-[#CBD5E1] border border-[#2F4FE0]/40"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsNewLeadOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#229622] hover:bg-[#29AE29] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Lead</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col">
        {isNewLeadOpen ? (
          <NewLeadModal
            isOpen={isNewLeadOpen}
            onClose={() => setIsNewLeadOpen(false)}
            onSaveLead={handleSaveNewLead}
            existingLeads={leads}
            currentUser={currentUser}
            users={users}
            variant="page"
          />
        ) : (
          <>
            {activeTab === "dashboard" && currentUser && (
              <Dashboard
                currentUser={currentUser}
                users={users}
                leads={leads}
                onOpenNewLead={() => setIsNewLeadOpen(true)}
                onSelectLead={(lead) => {
                  setSelectedLead(lead);
                  setSelectedLeadTab("guide");
                }}
                onNavigateTab={(tabId) => setActiveTab(tabId as TabType)}
                onAssignLead={handleAssignLead}
                adminFilterUserId={adminFilterUserId}
                setAdminFilterUserId={setAdminFilterUserId}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === "prospects" && (
              <ProspectsDirectory
                leads={searchedLeads}
                onSelectLead={(lead) => {
                  setSelectedLead(lead);
                  setSelectedLeadTab("guide");
                }}
                onUpdateStatus={handleUpdateLeadStatus}
                onGoToQuote={(lead) => {
                  setActiveQuoteLead(lead);
                  setSelectedLead(null);
                  setActiveTab("quotes");
                  showToast(`Cotizador CPQ cargado para ${lead.empresa}`);
                }}
                onOpenNewLead={() => setIsNewLeadOpen(true)}
                currentUser={currentUser}
                users={users}
                onAssignLead={handleAssignLead}
              />
            )}

            {activeTab === "pipeline" && (
              <PipelineKanban
                leads={searchedLeads}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onSelectLead={(lead) => {
                  setSelectedLead(lead);
                  setSelectedLeadTab("guide");
                }}
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
                  if (found) {
                    setSelectedLead(found);
                    setSelectedLeadTab("guide");
                  }
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

            {activeTab === "quotes" && <QuoteCalculator initialLead={activeQuoteLead} />}

            {activeTab === "retainers" && (
              <RetainersProjects retainers={retainers} projects={projects} />
            )}

            {activeTab === "settings" && (
              <ChannelSettings
                emailConfig={emailConfig}
                socialConfig={socialConfig}
                onSaveEmailConfig={handleSaveEmailConfig}
                onSaveSocialConfig={handleSaveSocialConfig}
              />
            )}

            {activeTab === "users" && currentUser && (
              <div className="space-y-4">
                {currentUser.rol !== "ADMIN" && (
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3 text-xs shadow-lg">
                    <span className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">
                      🛡️
                    </span>
                    <div>
                      <strong className="text-white block text-xs">Acceso en Modo Lectura ({currentUser.nombre} - {currentUser.rol})</strong>
                      <span className="text-slate-300 text-[11px]">
                        Para registrar nuevos usuarios, editar permisos RBAC o cambiar contraseñas, debes iniciar sesión con una cuenta Administrador.
                      </span>
                    </div>
                  </div>
                )}
                <UserManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  currentUser={currentUser}
                  leads={leads}
                  onAssignLead={handleAssignLead}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Minimalist Mercury CAD Footer (PDF Redesign) */}
      <footer className="bg-[#040B2A] border-t border-[#2F4FE0] px-4 sm:px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <span>Mercury Creation &amp; Design</span>
            <span className="text-[#94A3B8]">•</span>
            <span>Mendoza, Argentina</span>
          </div>
          <div className="flex items-center gap-2">
            <span>info@mercurycad.com.ar</span>
            <span className="text-[#94A3B8]">•</span>
            <a
              href="https://mercurycad.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#93C5FD] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
            >
              <span>mercurycad.com.ar</span>
              <span className="text-[11px] no-underline">↗</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateLeadStatus}
        onUpdateLead={handleUpdateLead}
        onGoToQuote={(lead) => {
          setActiveQuoteLead(lead);
          setSelectedLead(null);
          setActiveTab("quotes");
          showToast(`Cotizador CPQ cargado para ${lead.empresa}`);
        }}
        currentUser={currentUser}
        users={users}
        onAssignLead={handleAssignLead}
        initialTab={selectedLeadTab}
        onCreateProject={handleCreateProjectFromLead}
        onCreateRetainer={handleCreateRetainerFromLead}
      />
    </div>
  );
}
