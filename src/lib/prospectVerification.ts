import { Lead } from "../types/crm";

export interface VerificationLinks {
  socialHandle?: string;
  linkedinCompanyUrl?: string;
  linkedinPersonSearchUrl?: string;
  instagramSearchUrl?: string;
  xSearchUrl?: string;
  facebookSearchUrl?: string;
  websiteUrl?: string;
  googleCompanyUrl?: string;
  cuitSearchUrl?: string;
}

export interface QualityDiagnostic {
  score: number; // 0 to 100
  isCorporateEmail: boolean;
  hasValidPhone: boolean;
  hasSocialHandle: boolean;
  domain: string;
  items: { label: string; passed: boolean; detail: string }[];
}

export function extractSocialHandle(notas: string): string | null {
  if (!notas) return null;
  // Match "Red: LinkedIn@handle" or "Red: @handle" or "@handle"
  const match = notas.match(/Red:\s*(?:LinkedIn@|Instagram@|X@|Facebook@|@)?([a-zA-Z0-9._-]+)/i);
  if (match && match[1]) {
    const cleaned = match[1]
      .replace(/^LinkedIn@|^Instagram@|^X@|^@/i, "")
      .replace(/[.,;:!?]+$/, "")
      .trim();
    return cleaned.length > 0 ? cleaned : null;
  }
  return null;
}

export function extractDomain(email: string): string | null {
  if (!email || !email.includes("@")) return null;
  const parts = email.split("@");
  return parts[1]?.toLowerCase().trim() || null;
}

const FREE_EMAIL_PROVIDERS = new Set([
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "yahoo.com.ar",
  "outlook.com",
  "live.com",
  "icloud.com",
  "protonmail.com",
]);

export function isCorporateEmail(email: string): boolean {
  const domain = extractDomain(email);
  if (!domain) return false;
  return !FREE_EMAIL_PROVIDERS.has(domain);
}

export function generateVerificationLinks(lead: Lead): VerificationLinks {
  const handle = extractSocialHandle(lead.notas);
  const domain = extractDomain(lead.email);

  const cleanHandle = handle ? handle.replace(/^@/, "").trim() : "";
  const encodedNameCompany = encodeURIComponent(`${lead.nombre} ${lead.empresa}`);
  const encodedCompany = encodeURIComponent(`${lead.empresa} Mendoza`);

  return {
    socialHandle: cleanHandle || undefined,
    // LinkedIn company page and executive search
    linkedinCompanyUrl: cleanHandle
      ? `https://www.linkedin.com/company/${cleanHandle}`
      : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(lead.empresa)}`,
    linkedinPersonSearchUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodedNameCompany}`,
    // Instagram
    instagramSearchUrl: cleanHandle
      ? `https://www.instagram.com/${cleanHandle}/`
      : `https://www.instagram.com/explore/tags/${encodeURIComponent(lead.empresa.replace(/\s+/g, "").toLowerCase())}/`,
    // X (Twitter)
    xSearchUrl: `https://x.com/search?q=${encodedCompany}&f=user`,
    // Facebook
    facebookSearchUrl: `https://www.facebook.com/search/top?q=${encodedCompany}`,
    // Official Website
    websiteUrl: domain ? `https://${domain}` : undefined,
    // Google Business / News
    googleCompanyUrl: `https://www.google.com/search?q=${encodeURIComponent(`${lead.empresa} ${lead.nombre} Mendoza`)}`,
    // CUIT / AFIP Registry search
    cuitSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(`CUIT ${lead.empresa} Mendoza`)}`,
  };
}

export function checkDataQuality(lead: Lead): QualityDiagnostic {
  const domain = extractDomain(lead.email) || "Sin dominio";
  const corporate = isCorporateEmail(lead.email);
  const cleanPhone = lead.telefono.replace(/[^0-9]/g, "");
  const hasPhone = cleanPhone.length >= 8;
  const handle = extractSocialHandle(lead.notas);

  let score = 0;
  const items: { label: string; passed: boolean; detail: string }[] = [];

  // 1. Directivo / Decisor
  if (lead.nombre && lead.nombre.trim().length > 3) {
    score += 25;
    items.push({
      label: "Decisor Identificado",
      passed: true,
      detail: `${lead.nombre} (decisor clave)`,
    });
  } else {
    items.push({
      label: "Decisor Identificado",
      passed: false,
      detail: "Falta nombre del directivo",
    });
  }

  // 2. Empresa y Rubro
  if (lead.empresa && lead.empresa.trim().length > 2) {
    score += 25;
    items.push({
      label: "Empresa Registrada",
      passed: true,
      detail: `${lead.empresa} (${lead.servicioInteres})`,
    });
  } else {
    items.push({
      label: "Empresa Registrada",
      passed: false,
      detail: "Nombre de empresa no especificado",
    });
  }

  // 3. Email Corporativo
  if (corporate) {
    score += 25;
    items.push({
      label: "Email Corporativo",
      passed: true,
      detail: `@${domain} (dominio institucional propio)`,
    });
  } else if (lead.email && lead.email.includes("@")) {
    score += 15;
    items.push({
      label: "Email Genérico",
      passed: false,
      detail: `@${domain} (proveedor público)`,
    });
  } else {
    items.push({
      label: "Email",
      passed: false,
      detail: "Sin correo electrónico válido",
    });
  }

  // 4. Teléfono / WhatsApp
  if (hasPhone) {
    score += 15;
    items.push({
      label: "Línea Telefónica",
      passed: true,
      detail: `${lead.telefono} (validado para WhatsApp)`,
    });
  } else {
    items.push({
      label: "Línea Telefónica",
      passed: false,
      detail: "Número de teléfono incompleto",
    });
  }

  // 5. Red Social Detectada
  if (handle) {
    score += 10;
    items.push({
      label: "Canal B2B (LinkedIn)",
      passed: true,
      detail: `@${handle} listo para auditar`,
    });
  } else {
    items.push({
      label: "Canal B2B",
      passed: false,
      detail: "Sin perfil social directo registrado",
    });
  }

  return {
    score,
    isCorporateEmail: corporate,
    hasValidPhone: hasPhone,
    hasSocialHandle: !!handle,
    domain,
    items,
  };
}
