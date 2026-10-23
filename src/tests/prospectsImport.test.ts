import { describe, it, expect } from "vitest";
import importedLeads from "../data/importedLeads.json";
import { Lead } from "../types/crm";

describe("6. Módulo Base de Datos & Directorio de 200 Prospectos Importados", () => {
  const leads = importedLeads as Lead[];

  it("debe contener exactamente los 200 prospectos del archivo clientesP.csv", () => {
    expect(leads.length).toBe(200);
  });

  it("todos los prospectos deben tener campos obligatorios completos y válidos", () => {
    leads.forEach((lead, idx) => {
      expect(lead.id).toBeDefined();
      expect(lead.nombre).toBeTruthy();
      expect(lead.empresa).toBeTruthy();
      expect(lead.email).toBeTruthy();
      expect(lead.servicioInteres).toMatch(
        /^(UX_UI|WEB_DEVELOPMENT|CUSTOM_SOFTWARE|META_GOOGLE_ADS|BRANDING|MONTHLY_MAINTENANCE)$/
      );
      expect(lead.valorEstimado).toBeGreaterThan(0);
      expect(lead.moneda).toBe("USD");
      expect(lead.prioridad).toMatch(/^(Alta|Media|Baja)$/);
    });
  });

  it("debe contener las empresas insignia de Mendoza con sus directivos verificados", () => {
    const laur = leads.find((l) => l.empresa.includes("Laur"));
    expect(laur).toBeDefined();
    expect(laur?.nombre).toBe("Gabriel Guardia");

    const plantaUno = leads.find((l) => l.empresa.includes("Planta Uno"));
    expect(plantaUno).toBeDefined();
    expect(plantaUno?.nombre).toBe("Sofía Pescarmona");

    const montemar = leads.find((l) => l.empresa.includes("Montemar"));
    expect(montemar).toBeDefined();
    expect(montemar?.nombre).toBe("Federico Pagano");

    const anaia = leads.find((l) => l.empresa.includes("Anaia"));
    expect(anaia).toBeDefined();
    expect(anaia?.nombre).toBe("Patricia Serizola");
  });

  it("debe permitir búsqueda instantánea por empresa, contacto y palabra clave", () => {
    const search = (query: string) => {
      const q = query.toLowerCase();
      return leads.filter(
        (l) =>
          l.empresa.toLowerCase().includes(q) ||
          l.nombre.toLowerCase().includes(q) ||
          l.notas.toLowerCase().includes(q)
      );
    };

    const bodegaResults = search("Vino");
    expect(bodegaResults.length).toBeGreaterThan(0);

    const guardiaResults = search("Guardia");
    expect(guardiaResults.length).toBe(1);
    expect(guardiaResults[0].empresa).toBe("Olivícola Laur");
  });

  it("debe calcular el valor potencial total de la base en más de $500,000 USD", () => {
    const totalPotential = leads.reduce((acc, curr) => acc + curr.valorEstimado, 0);
    expect(totalPotential).toBeGreaterThan(500000);
  });
});
