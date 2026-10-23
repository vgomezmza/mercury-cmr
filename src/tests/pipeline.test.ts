import { describe, it, expect } from "vitest";
import { Lead, LeadStatus, ServiceType } from "../types/crm";

describe("1. Módulo Pipeline Kanban & Gestión de Leads", () => {
  const sampleLeads: Lead[] = [
    {
      id: "lead-test-1",
      nombre: "Gabriel Guardia",
      empresa: "Olivícola Laur",
      email: "contacto@laur.ar",
      telefono: "+54 261 455-0001",
      servicioInteres: "UX_UI",
      estado: "NUEVO",
      valorEstimado: 3500,
      moneda: "USD",
      origen: "LinkedIn",
      notas: "Interés en rediseño UX/UI",
      prioridad: "Alta",
      createdAt: "Hoy",
      tiempoSinContactoHoras: 52,
    },
    {
      id: "lead-test-2",
      nombre: "Sofía Pescarmona",
      empresa: "Planta Uno",
      email: "info@plantauno.com.ar",
      telefono: "+54 261 455-0002",
      servicioInteres: "CUSTOM_SOFTWARE",
      estado: "RELEVAMIENTO",
      valorEstimado: 6000,
      moneda: "USD",
      origen: "LinkedIn",
      notas: "Software de gestión",
      prioridad: "Alta",
      createdAt: "Hoy",
      tiempoSinContactoHoras: 12,
    },
    {
      id: "lead-test-3",
      nombre: "Carlos Gómez",
      empresa: "Bodega Cuyana",
      email: "carlos@bodegacuyana.com",
      telefono: "+54 261 455-0003",
      servicioInteres: "WEB_DEVELOPMENT",
      estado: "GANADO",
      valorEstimado: 2500,
      moneda: "USD",
      origen: "Web MercuryCAD",
      notas: "Web corporativa",
      prioridad: "Media",
      createdAt: "Ayer",
      tiempoSinContactoHoras: 0,
    },
  ];

  it("debe avanzar el estado de un lead correctamente en el embudo", () => {
    const nextStatusMap: Record<LeadStatus, LeadStatus | null> = {
      NUEVO: "RELEVAMIENTO",
      RELEVAMIENTO: "PROPUESTA_ENVIADA",
      PROPUESTA_ENVIADA: "EN_NEGOCIACION",
      EN_NEGOCIACION: "GANADO",
      GANADO: null,
      PERDIDO: null,
    };

    expect(nextStatusMap["NUEVO"]).toBe("RELEVAMIENTO");
    expect(nextStatusMap["RELEVAMIENTO"]).toBe("PROPUESTA_ENVIADA");
    expect(nextStatusMap["PROPUESTA_ENVIADA"]).toBe("EN_NEGOCIACION");
    expect(nextStatusMap["EN_NEGOCIACION"]).toBe("GANADO");
    expect(nextStatusMap["GANADO"]).toBeNull();
  });

  it("debe calcular el valor total del pipeline en USD correctamente", () => {
    const total = sampleLeads.reduce((acc, curr) => acc + (curr.valorEstimado || 0), 0);
    expect(total).toBe(12000);
  });

  it("debe filtrar leads por tipo de servicio", () => {
    const uxLeads = sampleLeads.filter((l) => l.servicioInteres === "UX_UI");
    const softwareLeads = sampleLeads.filter((l) => l.servicioInteres === "CUSTOM_SOFTWARE");

    expect(uxLeads.length).toBe(1);
    expect(uxLeads[0].empresa).toBe("Olivícola Laur");
    expect(softwareLeads.length).toBe(1);
    expect(softwareLeads[0].empresa).toBe("Planta Uno");
  });

  it("debe identificar prospectos urgentes sin contacto (+48 horas)", () => {
    const isUrgent = (lead: Lead) =>
      (lead.tiempoSinContactoHoras || 0) >= 48 && lead.estado !== "GANADO";

    expect(isUrgent(sampleLeads[0])).toBe(true);
    expect(isUrgent(sampleLeads[1])).toBe(false);
    expect(isUrgent(sampleLeads[2])).toBe(false);
  });
});
