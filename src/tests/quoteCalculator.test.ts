import { describe, it, expect } from "vitest";

describe("2. Módulo Cotizador Inteligente CPQ para Servicios de Mercury CAD", () => {
  const calculateQuote = (params: {
    includeUxUi: boolean;
    screenCount: number;
    includePrototype: boolean;
    includeDev: boolean;
    devType: "landing" | "corporate" | "ecommerce" | "software";
    hasAuthAndDb: boolean;
    includeAds: boolean;
    adBudget: number;
    includeMaintenance: boolean;
    maintenanceTier: "basico" | "proactivo" | "enterprise";
  }) => {
    const uxUiTotal = params.includeUxUi
      ? params.screenCount * 120 + (params.includePrototype ? 450 : 0)
      : 0;

    const devBaseMap = {
      landing: 650,
      corporate: 1600,
      ecommerce: 2800,
      software: 4500,
    };
    const devTotal = params.includeDev
      ? devBaseMap[params.devType] + (params.hasAuthAndDb ? 750 : 0)
      : 0;

    const adsSetupFee = 350;
    const adsManagementFee = params.adBudget * 0.15;
    const adsTotal = params.includeAds ? adsSetupFee + adsManagementFee : 0;

    const maintenanceMap = {
      basico: 250,
      proactivo: 450,
      enterprise: 850,
    };
    const maintenanceTotal = params.includeMaintenance
      ? maintenanceMap[params.maintenanceTier]
      : 0;

    const grandTotal = uxUiTotal + devTotal + adsTotal;
    const recurringTotal = maintenanceTotal;

    return {
      uxUiTotal,
      devTotal,
      adsTotal,
      grandTotal,
      recurringTotal,
    };
  };

  it("debe calcular el presupuesto de UX/UI con pantallas y prototipo en Figma", () => {
    const res = calculateQuote({
      includeUxUi: true,
      screenCount: 10,
      includePrototype: true,
      includeDev: false,
      devType: "corporate",
      hasAuthAndDb: false,
      includeAds: false,
      adBudget: 0,
      includeMaintenance: false,
      maintenanceTier: "basico",
    });

    // 10 * 120 + 450 = 1650 USD
    expect(res.uxUiTotal).toBe(1650);
    expect(res.grandTotal).toBe(1650);
  });

  it("debe calcular el costo de desarrollo de E-Commerce con arquitectura backend y autenticación", () => {
    const res = calculateQuote({
      includeUxUi: false,
      screenCount: 0,
      includePrototype: false,
      includeDev: true,
      devType: "ecommerce",
      hasAuthAndDb: true,
      includeAds: false,
      adBudget: 0,
      includeMaintenance: false,
      maintenanceTier: "basico",
    });

    // 2800 + 750 = 3550 USD
    expect(res.devTotal).toBe(3550);
    expect(res.grandTotal).toBe(3550);
  });

  it("debe calcular correctamente el fee de setup y gestión del 15% en campañas de Ads", () => {
    const res = calculateQuote({
      includeUxUi: false,
      screenCount: 0,
      includePrototype: false,
      includeDev: false,
      devType: "corporate",
      hasAuthAndDb: false,
      includeAds: true,
      adBudget: 1000,
      includeMaintenance: false,
      maintenanceTier: "basico",
    });

    // Setup 350 + 15% de 1000 (150) = 500 USD
    expect(res.adsTotal).toBe(500);
  });

  it("debe calcular una cotización integral con abono mensual recurrente (MRR)", () => {
    const res = calculateQuote({
      includeUxUi: true,
      screenCount: 15, // 15 * 120 = 1800
      includePrototype: true, // + 450 = 2250
      includeDev: true,
      devType: "software", // 4500
      hasAuthAndDb: true, // + 750 = 5250
      includeAds: true,
      adBudget: 2000, // 350 + 300 = 650
      includeMaintenance: true,
      maintenanceTier: "proactivo", // 450 USD/mes
    });

    // 2250 + 5250 + 650 = 8150 USD
    expect(res.grandTotal).toBe(8150);
    expect(res.recurringTotal).toBe(450);
  });
});
