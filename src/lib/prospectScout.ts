import { Lead } from "../types/crm";

export interface ScoutSuggestion {
  companyHandle: string;
  candidateDomains: string[];
  linkedinCompanyUrl: string;
  linkedinCompanySearchUrl: string;
  linkedinPersonUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  xHandle: string;
  xUrl: string;
  facebookUrl: string;
  websiteUrl: string;
  googleSearchUrl: string;
  googleMapsUrl: string;
  cuitSearchUrl: string;
}

/**
 * Normalizes text to create canonical handles and query strings
 */
export function normalizeForHandle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\./g, "") // remove periods (e.g. S.A. -> SA)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Generates canonical social profiles, internet search links and domain suggestions
 */
export function generateScoutSuggestions(empresa: string, nombre: string): ScoutSuggestion | null {
  const cleanEmpresa = empresa.trim();
  const cleanNombre = nombre.trim();

  if (!cleanEmpresa && !cleanNombre) return null;

  const target = cleanEmpresa || cleanNombre;
  const handle = normalizeForHandle(target);
  const cleanCompact = handle.replace(/_/g, "");

  const encodedEmpresa = encodeURIComponent(cleanEmpresa || target);
  const encodedFullName = encodeURIComponent(
    [cleanNombre, cleanEmpresa].filter(Boolean).join(" ")
  );
  const encodedMendoza = encodeURIComponent(`${target} Mendoza`);

  const primaryDomain = `${cleanCompact}.com.ar`;
  const candidateDomains = [
    `${cleanCompact}.com.ar`,
    `${cleanCompact}.com`,
    `${cleanCompact}.ar`,
    `${handle.replace(/_/g, "-")}.com.ar`,
  ];

  return {
    companyHandle: handle,
    candidateDomains,
    linkedinCompanyUrl: `https://www.linkedin.com/company/${handle}`,
    linkedinCompanySearchUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodedEmpresa}`,
    linkedinPersonUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodedFullName}`,
    instagramHandle: handle,
    instagramUrl: `https://www.instagram.com/${handle}/`,
    xHandle: handle.slice(0, 15),
    xUrl: `https://x.com/search?q=${encodedMendoza}&f=user`,
    facebookUrl: `https://www.facebook.com/search/top?q=${encodedMendoza}`,
    websiteUrl: `https://${primaryDomain}`,
    googleSearchUrl: `https://www.google.com/search?q=${encodedMendoza}`,
    googleMapsUrl: `https://www.google.com/maps/search/${encodedMendoza}`,
    cuitSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(`CUIT ${target} Mendoza`)}`,
  };
}

/**
 * Finds potential duplicate companies or persons already in the CRM
 */
export function findPotentialDuplicates(query: string, leads: Lead[]): Lead[] {
  if (!query || query.trim().length < 3) return [];
  const q = query.toLowerCase().trim();

  return leads
    .filter((l) => {
      const matchEmpresa = l.empresa.toLowerCase().includes(q);
      const matchNombre = l.nombre.toLowerCase().includes(q);
      return matchEmpresa || matchNombre;
    })
    .slice(0, 3);
}
