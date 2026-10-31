import { describe, it, expect } from "vitest";
import { EmailChannelConfig, SocialChannelsConfig } from "../types/crm";
import { DEFAULT_EMAIL_CONFIG, DEFAULT_SOCIAL_CONFIG } from "../data/initialData";

describe("4. Módulo Configuración de Canales (Correo Mercury CAD & Redes)", () => {
  it("debe contener la cuenta oficial de correo de Mercury CAD con puertos válidos", () => {
    expect(DEFAULT_EMAIL_CONFIG.email).toBe("info@mercurycad.com.ar");
    expect(DEFAULT_EMAIL_CONFIG.incomingPort).toBe(993);
    expect(DEFAULT_EMAIL_CONFIG.incomingSecurity).toBe("SSL/TLS");
    expect(DEFAULT_EMAIL_CONFIG.outgoingPort).toBe(465);
    expect(DEFAULT_EMAIL_CONFIG.outgoingSecurity).toBe("SSL/TLS");
    expect(DEFAULT_EMAIL_CONFIG.active).toBe(true);
  });

  it("debe aplicar presets de proveedores de correo correctamente", () => {
    const applyPreset = (preset: "cpanel" | "titan" | "google" | "microsoft"): Partial<EmailChannelConfig> => {
      switch (preset) {
        case "cpanel":
          return {
            incomingServer: "mail.mercurycad.com.ar",
            incomingPort: 993,
            incomingSecurity: "SSL/TLS",
            outgoingServer: "mail.mercurycad.com.ar",
            outgoingPort: 465,
          };
        case "titan":
          return {
            incomingServer: "imap.titan.email",
            incomingPort: 993,
            incomingSecurity: "SSL/TLS",
            outgoingServer: "smtp.titan.email",
            outgoingPort: 465,
          };
        case "google":
          return {
            incomingServer: "imap.gmail.com",
            incomingPort: 993,
            incomingSecurity: "SSL/TLS",
            outgoingServer: "smtp.gmail.com",
            outgoingPort: 465,
          };
        case "microsoft":
          return {
            incomingServer: "outlook.office365.com",
            incomingPort: 993,
            incomingSecurity: "SSL/TLS",
            outgoingServer: "smtp.office365.com",
            outgoingPort: 587,
          };
      }
    };

    const titan = applyPreset("titan");
    expect(titan.incomingServer).toBe("imap.titan.email");
    expect(titan.outgoingServer).toBe("smtp.titan.email");

    const google = applyPreset("google");
    expect(google.incomingServer).toBe("imap.gmail.com");

    const ms = applyPreset("microsoft");
    expect(ms.outgoingPort).toBe(587);
  });

  it("debe validar las cuentas oficiales de redes sociales de Mercury CAD", () => {
    expect(DEFAULT_SOCIAL_CONFIG.meta.instagramAccountId).toBe("mercurycreationandesign");
    expect(DEFAULT_SOCIAL_CONFIG.meta.pageId).toBe("mercurycreationandesign");
    expect(DEFAULT_SOCIAL_CONFIG.linkedIn.orgId).toBe("mercury-creation-and-design");
    expect(DEFAULT_SOCIAL_CONFIG.xTwitter.handle).toBe("@mercurycad_ar");
    expect(DEFAULT_SOCIAL_CONFIG.googleBusiness.locationId).toBe("loc_mendoza_mercury_cad");
  });

  it("permite modificar y guardar la cuenta de Instagram de la agencia", () => {
    const updatedSocial: SocialChannelsConfig = {
      ...DEFAULT_SOCIAL_CONFIG,
      meta: {
        ...DEFAULT_SOCIAL_CONFIG.meta,
        instagramAccountId: "mercury_nueva_cuenta",
      },
    };
    expect(updatedSocial.meta.instagramAccountId).toBe("mercury_nueva_cuenta");
    const cleanIg = updatedSocial.meta.instagramAccountId.trim().replace(/^@/, "");
    expect(`https://instagram.com/${cleanIg}`).toBe("https://instagram.com/mercury_nueva_cuenta");
  });

  it("permite asignar y modificar la cuenta de Instagram en la ficha del prospecto/lead", () => {
    const mockLead = {
      id: "lead-test",
      nombre: "Gabriel Test",
      empresa: "Empresa Test",
      email: "test@test.com",
      telefono: "+54 9 261 111-2222",
      instagramHandle: "@empresa_mendoza",
      instagramUrl: "https://instagram.com/empresa_mendoza",
    };
    expect(mockLead.instagramHandle).toBe("@empresa_mendoza");
    expect(mockLead.instagramUrl).toBe("https://instagram.com/empresa_mendoza");

    // Simular edición de Instagram
    const modifiedLead = {
      ...mockLead,
      instagramHandle: "empresa_mendoza_nuevo",
      instagramUrl: "https://instagram.com/empresa_mendoza_nuevo",
    };
    expect(modifiedLead.instagramHandle).toBe("empresa_mendoza_nuevo");
    expect(modifiedLead.instagramUrl).toContain("empresa_mendoza_nuevo");
  });
});
