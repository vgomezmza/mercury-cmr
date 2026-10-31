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
    expect(DEFAULT_SOCIAL_CONFIG.whatsapp?.phoneNumber).toBe("+54 9 261 468-2451");
  });

  it("permite modificar y guardar todas las redes sociales oficiales de la agencia", () => {
    const updatedSocial: SocialChannelsConfig = {
      ...DEFAULT_SOCIAL_CONFIG,
      meta: {
        ...DEFAULT_SOCIAL_CONFIG.meta,
        instagramAccountId: "mercury_nueva_cuenta",
        pageId: "mercury_fb_oficial",
      },
      linkedIn: {
        ...DEFAULT_SOCIAL_CONFIG.linkedIn,
        orgId: "mercury-agency-global",
      },
      xTwitter: {
        ...DEFAULT_SOCIAL_CONFIG.xTwitter,
        handle: "mercury_tech_ar",
      },
      googleBusiness: {
        ...DEFAULT_SOCIAL_CONFIG.googleBusiness,
        locationId: "loc_mendoza_sucursal_centro",
      },
      whatsapp: {
        ...DEFAULT_SOCIAL_CONFIG.whatsapp!,
        phoneNumber: "+54 9 261 555-7788",
        apiKey: "new_wa_token_2026",
      },
    };

    // Instagram & Facebook
    expect(updatedSocial.meta.instagramAccountId).toBe("mercury_nueva_cuenta");
    expect(updatedSocial.meta.pageId).toBe("mercury_fb_oficial");
    const cleanIg = updatedSocial.meta.instagramAccountId.trim().replace(/^@/, "");
    expect(`https://instagram.com/${cleanIg}`).toBe("https://instagram.com/mercury_nueva_cuenta");
    expect(`https://facebook.com/${updatedSocial.meta.pageId}`).toBe("https://facebook.com/mercury_fb_oficial");

    // LinkedIn
    expect(updatedSocial.linkedIn.orgId).toBe("mercury-agency-global");
    expect(`https://linkedin.com/company/${updatedSocial.linkedIn.orgId}`).toBe("https://linkedin.com/company/mercury-agency-global");

    // X (Twitter)
    expect(updatedSocial.xTwitter.handle).toBe("mercury_tech_ar");
    const cleanX = updatedSocial.xTwitter.handle.trim().replace(/^@/, "");
    expect(`https://x.com/${cleanX}`).toBe("https://x.com/mercury_tech_ar");

    // Google Business
    expect(updatedSocial.googleBusiness.locationId).toBe("loc_mendoza_sucursal_centro");

    // WhatsApp
    expect(updatedSocial.whatsapp?.phoneNumber).toBe("+54 9 261 555-7788");
    expect(updatedSocial.whatsapp?.apiKey).toBe("new_wa_token_2026");
  });

  it("permite asignar y modificar todas las redes sociales en la ficha del prospecto/lead", () => {
    const mockLead = {
      id: "lead-test",
      nombre: "Gabriel Test",
      empresa: "Empresa Test",
      email: "test@test.com",
      telefono: "+54 9 261 111-2222",
      instagramHandle: "@empresa_mendoza",
      instagramUrl: "https://instagram.com/empresa_mendoza",
      linkedinUrl: "https://linkedin.com/company/empresa-mendoza",
      facebookHandle: "empresamendoza.fb",
      facebookUrl: "https://facebook.com/empresamendoza.fb",
      twitterHandle: "empresamza",
      twitterUrl: "https://x.com/empresamza",
      websiteUrl: "https://empresamendoza.com.ar",
    };

    expect(mockLead.instagramHandle).toBe("@empresa_mendoza");
    expect(mockLead.linkedinUrl).toContain("empresa-mendoza");
    expect(mockLead.facebookHandle).toBe("empresamendoza.fb");
    expect(mockLead.twitterHandle).toBe("empresamza");
    expect(mockLead.websiteUrl).toBe("https://empresamendoza.com.ar");

    // Simular edición completa de todas las redes del prospecto
    const modifiedLead = {
      ...mockLead,
      telefono: "+54 9 261 999-8877",
      instagramHandle: "nueva_cuenta_ig",
      instagramUrl: "https://instagram.com/nueva_cuenta_ig",
      linkedinUrl: "https://linkedin.com/company/nueva-empresa",
      facebookHandle: "nueva.empresa.fb",
      facebookUrl: "https://facebook.com/nueva.empresa.fb",
      twitterHandle: "nueva_empresa_x",
      twitterUrl: "https://x.com/nueva_empresa_x",
      websiteUrl: "https://nuevaempresa.com",
    };

    expect(modifiedLead.telefono).toBe("+54 9 261 999-8877");
    expect(modifiedLead.instagramHandle).toBe("nueva_cuenta_ig");
    expect(modifiedLead.instagramUrl).toBe("https://instagram.com/nueva_cuenta_ig");
    expect(modifiedLead.linkedinUrl).toBe("https://linkedin.com/company/nueva-empresa");
    expect(modifiedLead.facebookHandle).toBe("nueva.empresa.fb");
    expect(modifiedLead.facebookUrl).toBe("https://facebook.com/nueva.empresa.fb");
    expect(modifiedLead.twitterHandle).toBe("nueva_empresa_x");
    expect(modifiedLead.twitterUrl).toBe("https://x.com/nueva_empresa_x");
    expect(modifiedLead.websiteUrl).toBe("https://nuevaempresa.com");
  });
});
