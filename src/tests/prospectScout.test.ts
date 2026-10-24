import { describe, it, expect } from "vitest";
import {
  generateScoutSuggestions,
  findPotentialDuplicates,
  normalizeForHandle,
} from "../lib/prospectScout";
import importedLeads from "../data/importedLeads.json";
import { Lead } from "../types/crm";

describe("7. Módulo de Radar de Prospección & Búsqueda Social en Vivo", () => {
  const leads = importedLeads as Lead[];

  it("debe normalizar correctamente nombres de empresa y personas para redes", () => {
    expect(normalizeForHandle("Bodega Catena Zapata")).toBe("bodega_catena_zapata");
    expect(normalizeForHandle("Café & Cía. S.A.")).toBe("cafe_cia_sa");
  });

  it("debe generar perfiles sugeridos de LinkedIn, Instagram, Dominios y Google al escribir una empresa", () => {
    const scout = generateScoutSuggestions("Bodega Norton", "Michael Halstrick");
    expect(scout).not.toBeNull();
    if (!scout) return;

    expect(scout.companyHandle).toBe("bodega_norton");
    expect(scout.linkedinCompanyUrl).toContain("linkedin.com/company/bodega_norton");
    expect(scout.linkedinPersonUrl).toContain("Michael%20Halstrick%20Bodega%20Norton");
    expect(scout.instagramUrl).toContain("instagram.com/bodega_norton/");
    expect(scout.candidateDomains).toContain("bodeganorton.com.ar");
    expect(scout.googleSearchUrl).toContain("Bodega%20Norton%20Mendoza");
    expect(scout.cuitSearchUrl).toContain("CUIT%20Bodega%20Norton%20Mendoza");
  });

  it("debe retornar null si no se ingresa ni empresa ni nombre", () => {
    expect(generateScoutSuggestions("", "")).toBeNull();
    expect(generateScoutSuggestions("   ", "   ")).toBeNull();
  });

  it("debe detectar empresas duplicadas ya existentes en la base de datos", () => {
    // Laur exists in leads
    const duplicates = findPotentialDuplicates("Laur", leads);
    expect(duplicates.length).toBeGreaterThan(0);
    expect(duplicates.some((d) => d.empresa.includes("Laur"))).toBe(true);

    // Guarding check
    const guardiaDupes = findPotentialDuplicates("Guardia", leads);
    expect(guardiaDupes.length).toBeGreaterThan(0);
    expect(guardiaDupes[0].nombre).toContain("Guardia");

    // Non-existent company should return empty array
    const nonExistent = findPotentialDuplicates("EmpresaInexistenteXYZ12345", leads);
    expect(nonExistent.length).toBe(0);
  });
});
