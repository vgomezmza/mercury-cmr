import { describe, it, expect } from "vitest";
import { Retainer, Project } from "../types/crm";
import { DEMO_RETAINERS, DEMO_PROJECTS } from "../data/initialData";

describe("7. Módulo Abonos Recurrentes (MRR) & Hitos de Proyectos", () => {
  it("debe calcular el ingreso mensual recurrente (MRR) de los contratos activos", () => {
    const totalMrr = DEMO_RETAINERS.filter((r) => r.estado === "ACTIVO").reduce(
      (acc, curr) => acc + curr.cuotaMensual,
      0
    );

    expect(totalMrr).toBeGreaterThan(0);
    // 450 + 750 + 550 = 1750 USD
    expect(totalMrr).toBe(1750);
  });

  it("cada contrato de abono debe tener día de cobro y próxima fecha válidos", () => {
    DEMO_RETAINERS.forEach((ret) => {
      expect(ret.diaCobro).toBeGreaterThanOrEqual(1);
      expect(ret.diaCobro).toBeLessThanOrEqual(31);
      expect(ret.proximaFecha).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(ret.cuotaMensual).toBeGreaterThan(0);
      expect(ret.moneda).toBe("USD");
    });
  });

  it("debe rastrear el progreso porcentual e hitos de entrega de proyectos activos", () => {
    DEMO_PROJECTS.forEach((proj) => {
      expect(proj.progreso).toBeGreaterThanOrEqual(0);
      expect(proj.progreso).toBeLessThanOrEqual(100);
      expect(proj.faseActual).toMatch(
        /^(Wireframes|Prototipo Figma|Desarrollo Frontend|Desarrollo Backend|QA y Testing|Despliegue)$/
      );
      expect(proj.fechaEntrega).toBeTruthy();
    });
  });

  it("debe contener enlaces a recursos del proyecto (Figma, GitHub, Staging)", () => {
    const proj1 = DEMO_PROJECTS.find((p) => p.id === "proj-1");
    expect(proj1).toBeDefined();
    expect(proj1?.figmaUrl).toContain("figma.com");
    expect(proj1?.gitUrl).toContain("github.com");
    expect(proj1?.stagingUrl).toContain("mercurycad.com.ar");
  });
});
