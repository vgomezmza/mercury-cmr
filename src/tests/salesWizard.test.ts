import { describe, it, expect } from "vitest";
import {
  SALES_STAGES_GUIDE,
  ORDERED_SALES_STAGES,
  calculateSalesProgress,
  getWhatsAppWelcomeTemplate,
  getWhatsAppProposalTemplate,
} from "../lib/salesProcessGuide";
import type { Lead } from "../types/crm";

describe("Sales Closing Wizard & Step-by-Step Guide", () => {
  const mockLead: Lead = {
    id: "lead-test-1",
    nombre: "Laura Catena",
    empresa: "Bodega Catena Zapata",
    email: "laura@catenazapata.com.ar",
    telefono: "+54 261 400-1122",
    servicioInteres: "UX_UI",
    estado: "NUEVO",
    valorEstimado: 3500,
    moneda: "USD",
    origen: "LinkedIn",
    notas: "Buscan rediseño de portal para enoturismo.",
    prioridad: "Alta",
    createdAt: "2026-10-27",
    checklistVenta: {
      contactoValidado: true,
      radarRedesRevisado: true,
      primerMensajeEnviado: false,
    },
  };

  it("should have all 5 ordered sales stages in correct chronological sequence", () => {
    expect(ORDERED_SALES_STAGES).toEqual([
      "NUEVO",
      "RELEVAMIENTO",
      "PROPUESTA_ENVIADA",
      "EN_NEGOCIACION",
      "GANADO",
    ]);

    expect(SALES_STAGES_GUIDE.NUEVO.nextStatus).toBe("RELEVAMIENTO");
    expect(SALES_STAGES_GUIDE.RELEVAMIENTO.nextStatus).toBe("PROPUESTA_ENVIADA");
    expect(SALES_STAGES_GUIDE.PROPUESTA_ENVIADA.nextStatus).toBe("EN_NEGOCIACION");
    expect(SALES_STAGES_GUIDE.EN_NEGOCIACION.nextStatus).toBe("GANADO");
    expect(SALES_STAGES_GUIDE.GANADO.nextStatus).toBeNull();
  });

  it("should calculate progressive closing percentage according to sales stage", () => {
    // Stage 1: NUEVO (base 0% to 20%)
    const pNuevo = calculateSalesProgress({
      ...mockLead,
      estado: "NUEVO",
      checklistVenta: { contactoValidado: true, radarRedesRevisado: true },
    });
    expect(pNuevo.progressPercent).toBeGreaterThanOrEqual(10);
    expect(pNuevo.progressPercent).toBeLessThanOrEqual(25);

    // Stage 2: RELEVAMIENTO (base 20% to 40%)
    const pRelevamiento = calculateSalesProgress({
      ...mockLead,
      estado: "RELEVAMIENTO",
    });
    expect(pRelevamiento.progressPercent).toBeGreaterThanOrEqual(20);

    // Stage 3: PROPUESTA_ENVIADA
    const pPropuesta = calculateSalesProgress({
      ...mockLead,
      estado: "PROPUESTA_ENVIADA",
    });
    expect(pPropuesta.progressPercent).toBeGreaterThanOrEqual(40);

    // Stage 4: EN_NEGOCIACION
    const pNegociacion = calculateSalesProgress({
      ...mockLead,
      estado: "EN_NEGOCIACION",
    });
    expect(pNegociacion.progressPercent).toBeGreaterThanOrEqual(60);

    // Stage 5: GANADO (100% complete)
    const pGanado = calculateSalesProgress({
      ...mockLead,
      estado: "GANADO",
    });
    expect(pGanado.progressPercent).toBe(100);

    // Stage PERDIDO
    const pPerdido = calculateSalesProgress({
      ...mockLead,
      estado: "PERDIDO",
    });
    expect(pPerdido.progressPercent).toBe(0);
  });

  it("should generate personalized WhatsApp welcome template for new leads", () => {
    const welcome = getWhatsAppWelcomeTemplate(mockLead, "Víctor Gómez");

    expect(welcome).toContain("Laura Catena");
    expect(welcome).toContain("Víctor Gómez");
    expect(welcome).toContain("Mercury CAD");
    expect(welcome).toContain("Bodega Catena Zapata");
    expect(welcome).toContain("ux ui");
  });

  it("should generate formal proposal template for WhatsApp CPQ closing", () => {
    const proposal = getWhatsAppProposalTemplate(mockLead, "Víctor Gómez");

    expect(proposal).toContain("Laura Catena");
    expect(proposal).toContain("Bodega Catena Zapata");
    expect(proposal).toContain("Mercury CAD");
    expect(proposal).toContain("$3.500 USD");
  });

  it("should track stage tasks completion count accurately", () => {
    const leadWithTasks: Lead = {
      ...mockLead,
      estado: "NUEVO",
      checklistVenta: {
        contactoValidado: true,
        radarRedesRevisado: true,
        primerMensajeEnviado: true,
      },
    };

    const stats = calculateSalesProgress(leadWithTasks);
    expect(stats.stageCompletedTasksCount).toBe(3);
    expect(stats.stageTotalTasksCount).toBe(3);
    expect(stats.completedTasksCount).toBe(3);
  });
});
