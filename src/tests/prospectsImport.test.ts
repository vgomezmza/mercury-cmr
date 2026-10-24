import { describe, it, expect } from "vitest";
import importedLeads from "../data/importedLeads.json";
import { Lead } from "../types/crm";
import {
  extractSocialHandle,
  extractDomain,
  isCorporateEmail,
  generateVerificationLinks,
  checkDataQuality,
} from "../lib/prospectVerification";

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

  describe("Auditoría y Comprobación Multicanal de Redes Sociales", () => {
    it("debe extraer correctamente handles de redes desde las notas del prospecto", () => {
      const handle = extractSocialHandle("Red: LinkedIn@laur_olivicola. Desafío ecommerce.");
      expect(handle).toBe("laur_olivicola");

      const handleNull = extractSocialHandle("Sin notas de redes.");
      expect(handleNull).toBeNull();
    });

    it("debe distinguir dominios corporativos institucionales de proveedores genéricos", () => {
      expect(isCorporateEmail("contacto@bodega-laur.com.ar")).toBe(true);
      expect(isCorporateEmail("gerencia@montemar.com.ar")).toBe(true);
      expect(isCorporateEmail("usuario@gmail.com")).toBe(false);
      expect(isCorporateEmail("empresa@hotmail.com")).toBe(false);
    });

    it("debe generar enlaces de 1-clic válidos para LinkedIn, Instagram, X, Web y CUIT", () => {
      const lead = leads[0];
      const links = generateVerificationLinks(lead);

      expect(links.linkedinCompanyUrl).toBeDefined();
      expect(links.linkedinCompanyUrl).toContain("linkedin.com");
      expect(links.linkedinPersonSearchUrl).toContain(encodeURIComponent(lead.nombre));
      expect(links.instagramSearchUrl).toContain("instagram.com");
      expect(links.xSearchUrl).toContain("x.com/search");
      expect(links.googleCompanyUrl).toContain("google.com/search");
      expect(links.cuitSearchUrl).toContain("CUIT");
    });

    it("debe evaluar el score de calidad de datos y generar diagnóstico de consistencia", () => {
      const lead = leads[0];
      const diagnostic = checkDataQuality(lead);

      expect(diagnostic.score).toBeGreaterThanOrEqual(60);
      expect(diagnostic.items.length).toBe(5);
      expect(diagnostic.items[0].label).toBe("Decisor Identificado");
      expect(diagnostic.items[0].passed).toBe(true);
    });
  });
});
