import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import {
  INITIAL_USERS,
  INITIAL_LEADS,
  DEMO_OPINIONS,
  DEMO_RETAINERS,
  DEMO_PROJECTS,
  INITIAL_SOCIAL_FEED,
  DEFAULT_EMAIL_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
} from "../data/initialData";

// Components
import { LoginScreen } from "../components/LoginScreen";
import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { ProspectsDirectory } from "../components/ProspectsDirectory";
import { PipelineKanban } from "../components/PipelineKanban";
import { OpinionsMonitor } from "../components/OpinionsMonitor";
import { SocialHub } from "../components/SocialHub";
import { QuoteCalculator } from "../components/QuoteCalculator";
import { RetainersProjects } from "../components/RetainersProjects";
import { ChannelSettings } from "../components/ChannelSettings";
import { UserManagement } from "../components/UserManagement";
import { NewLeadModal } from "../components/NewLeadModal";
import { LeadDetailModal } from "../components/LeadDetailModal";
import { SocialSimulatorModal } from "../components/SocialSimulatorModal";
import Home from "../app/page";

describe("Verificación exhaustiva de montaje y apertura de todas las vistas del CRM", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const adminUser = INITIAL_USERS[0]; // Víctor (ADMIN)

  it("1. Vista: LoginScreen (Pantalla de Acceso)", async () => {
    await act(async () => {
      root.render(
        <LoginScreen
          users={INITIAL_USERS}
          onLogin={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Iniciar Sesión");
    expect(container.innerHTML).toContain("tu_correo@mercurycad.com.ar");
    expect(container.innerHTML).toContain("Ingresar al Sistema Mercury");
    expect(container.innerHTML).not.toContain("Acceso Rápido con 1 Clic");
  });

  it("2. Vista: Header (Barra de Navegación y Perfil)", async () => {
    await act(async () => {
      root.render(
        <Header
          onOpenNewLead={() => {}}
          onOpenUsers={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
          leadsCount={INITIAL_LEADS.length}
          totalPipelineUsd={50000}
          mrrTotalUsd={1500}
          currentUser={adminUser}
          onLogout={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Mercury Creation &amp; Design");
    expect(container.innerHTML).toContain(adminUser.nombre);
    expect(container.innerHTML).toContain("Nuevo Lead");
    expect(container.innerHTML).toContain("Gestión de Usuarios");
  });

  it("3. Vista: Dashboard (Inicio / Tablero de Control)", async () => {
    await act(async () => {
      root.render(
        <Dashboard
          currentUser={adminUser}
          users={INITIAL_USERS}
          leads={INITIAL_LEADS}
          onOpenNewLead={() => {}}
          onSelectLead={() => {}}
          onNavigateTab={() => {}}
          onAssignLead={() => {}}
          adminFilterUserId="ALL"
          setAdminFilterUserId={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("¡Hola, Víctor!");
    expect(container.innerHTML).toContain("Pipeline Estimado");
    expect(container.innerHTML).toContain("Clientes que requieren tu atención hoy");
  });

  it("4. Vista: ProspectsDirectory (Directorio de Prospectos)", async () => {
    await act(async () => {
      root.render(
        <ProspectsDirectory
          leads={INITIAL_LEADS}
          onSelectLead={() => {}}
          onUpdateStatus={() => {}}
          onGoToQuote={() => {}}
          onOpenNewLead={() => {}}
          currentUser={adminUser}
          users={INITIAL_USERS}
          onAssignLead={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Total Prospectos");
    expect(container.innerHTML).toContain(INITIAL_LEADS[0].empresa);
  });

  it("5. Vista: PipelineKanban (Tablero Kanban de Ventas)", async () => {
    await act(async () => {
      root.render(
        <PipelineKanban
          leads={INITIAL_LEADS}
          onUpdateLeadStatus={() => {}}
          onSelectLead={() => {}}
          filterService="TODOS"
          setFilterService={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Nuevo Lead");
    expect(container.innerHTML).toContain("Relevamiento / Diagnóstico");
    expect(container.innerHTML).toContain("Propuesta Enviada");
    expect(container.innerHTML).toContain("En Negociación");
    expect(container.innerHTML).toContain("Ganado (Pase a Proyecto)");
  });

  it("6. Vista: OpinionsMonitor (Monitor de Opiniones y Reseñas)", async () => {
    await act(async () => {
      root.render(
        <OpinionsMonitor
          opinions={DEMO_OPINIONS}
          onReplyOpinion={() => {}}
          onSelectLeadById={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Satisfacción de Clientes");
    expect(container.innerHTML).toContain(DEMO_OPINIONS[0].autor);
  });

  it("7. Vista: SocialHub (Bandeja Multicanal de Redes Sociales)", async () => {
    await act(async () => {
      root.render(
        <SocialHub
          socialFeed={INITIAL_SOCIAL_FEED}
          onConvertToLead={() => {}}
          onSendReply={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Facebook");
    expect(container.innerHTML).toContain("Instagram");
    expect(container.innerHTML).toContain("WhatsApp");
  });

  it("8. Vista: QuoteCalculator (Cotizador de Proyectos CPQ)", async () => {
    await act(async () => {
      root.render(
        <QuoteCalculator
          initialLead={INITIAL_LEADS[0]}
        />
      );
    });

    expect(container.innerHTML).toContain("Datos del Prospecto");
    expect(container.innerHTML).toContain("Diseño UX/UI &amp; Prototipado Figma");
  });

  it("9. Vista: RetainersProjects (Abonos Recurrentes y Proyectos)", async () => {
    await act(async () => {
      root.render(
        <RetainersProjects
          retainers={DEMO_RETAINERS}
          projects={DEMO_PROJECTS}
        />
      );
    });

    expect(container.innerHTML).toContain("MRR Recurrente Mensual");
    expect(container.innerHTML).toContain("Proyectos en Producción");
    expect(container.innerHTML).toContain(DEMO_RETAINERS[0].empresa);
  });

  it("10. Vista: ChannelSettings (Configuración de Canales)", async () => {
    await act(async () => {
      root.render(
        <ChannelSettings
          emailConfig={DEFAULT_EMAIL_CONFIG}
          socialConfig={DEFAULT_SOCIAL_CONFIG}
          onSaveEmailConfig={() => {}}
          onSaveSocialConfig={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("WhatsApp Web Bridge");
    expect(container.innerHTML).toContain("Correo Mercury CAD");
  });

  it("11. Vista: UserManagement (Gestión de Usuarios RBAC)", async () => {
    await act(async () => {
      root.render(
        <UserManagement
          users={INITIAL_USERS}
          onAddUser={() => {}}
          onUpdateUser={() => {}}
          onDeleteUser={() => {}}
          currentUser={adminUser}
          leads={INITIAL_LEADS}
          onAssignLead={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Directorio de Colaboradores");
    expect(container.innerHTML).toContain("Registrar Nuevo Usuario");
  });

  it("12. Modal: NewLeadModal (Alta y Calificación de Lead)", async () => {
    await act(async () => {
      root.render(
        <NewLeadModal
          isOpen={true}
          onClose={() => {}}
          onSaveLead={() => {}}
          existingLeads={INITIAL_LEADS}
          currentUser={adminUser}
          users={INITIAL_USERS}
        />
      );
    });

    expect(container.innerHTML).toContain("Paso 1: Identificación del Prospecto");
    expect(container.innerHTML).toContain("Empresa / Organización");
  });

  it("13. Modal: LeadDetailModal (Expediente, Guía de Cierre y WhatsApp)", async () => {
    await act(async () => {
      root.render(
        <LeadDetailModal
          lead={INITIAL_LEADS[0]}
          onClose={() => {}}
          onUpdateStatus={() => {}}
          onUpdateLead={() => {}}
          onGoToQuote={() => {}}
          currentUser={adminUser}
          users={INITIAL_USERS}
          onAssignLead={() => {}}
          initialTab="guide"
          onCreateProject={() => {}}
          onCreateRetainer={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Ruta Paso a Paso hacia el Cierre");
    expect(container.innerHTML).toContain("Inversión Estimada");
  });

  it("14. Modal: SocialSimulatorModal (Simulador de Mensajes)", async () => {
    await act(async () => {
      root.render(
        <SocialSimulatorModal
          isOpen={true}
          onClose={() => {}}
          onSimulate={() => {}}
        />
      );
    });

    expect(container.innerHTML).toContain("Simulador de Webhooks y APIs");
  });

  it("15. Aplicación Principal Home: Pantalla Login cuando no hay sesión", async () => {
    localStorage.clear();
    await act(async () => {
      root.render(<Home />);
    });

    expect(container.innerHTML).toContain("Iniciar Sesión");
    expect(container.innerHTML).toContain("tu_correo@mercurycad.com.ar");
  });

  it("16. Aplicación Principal Home: Todas las pestañas activas cuando hay sesión iniciada", async () => {
    localStorage.setItem(
      "mercurycad_active_user",
      JSON.stringify(adminUser)
    );
    await act(async () => {
      root.render(<Home />);
    });

    expect(container.innerHTML).toContain("Mercury Creation &amp; Design");
    expect(container.innerHTML).toContain("Inicio / Tablero");
    expect(container.innerHTML).toContain("Directorio Prospectos");
    expect(container.innerHTML).toContain("Pipeline Kanban");
    expect(container.innerHTML).toContain("Opiniones &amp; Reseñas");
    expect(container.innerHTML).toContain("Social Hub");
    expect(container.innerHTML).toContain("Cotizador CPQ");
    expect(container.innerHTML).toContain("Abonos &amp; Proyectos");
    expect(container.innerHTML).toContain("Configuración Canales");
    expect(container.innerHTML).toContain("Gestión de Usuarios");
    localStorage.clear();
  });
});
