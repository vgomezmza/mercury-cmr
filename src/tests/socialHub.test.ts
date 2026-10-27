import { describe, it, expect } from "vitest";
import { SocialInteraction, Lead, SocialPlatform } from "../types/crm";

describe("3. Módulo Social Hub & Omnicanalidad (Facebook, Instagram, LinkedIn, X)", () => {
  const sampleFeed: SocialInteraction[] = [
    {
      id: "soc-1",
      plataforma: "INSTAGRAM",
      remitente: "Julián Albarracín",
      handle: "@julian_alturas",
      contenido: "Consulta por rediseño de e-commerce vitivinícola",
      fecha: "Hoy 10:24 AM",
      respondido: true,
      sentiment: "Interés Alto",
    },
    {
      id: "soc-2",
      plataforma: "FACEBOOK",
      remitente: "Sofía Valenzuela",
      handle: "Campaña Meta Ads Mendoza",
      contenido: "Formulario de Lead completado",
      fecha: "Hoy 09:15 AM",
      respondido: false,
      sentiment: "Interés Alto",
    },
    {
      id: "soc-3",
      plataforma: "LINKEDIN",
      remitente: "Mariana Soria",
      handle: "Operations Director @ Logística",
      contenido: "Buscamos agencia de software para intranet",
      fecha: "Ayer 16:40 PM",
      respondido: false,
      sentiment: "Positivo",
    },
    {
      id: "soc-4",
      plataforma: "X_TWITTER",
      remitente: "TechFounder",
      handle: "@ignacio_devops",
      contenido: "¿Recomiendan a Mercury CAD para producto en Figma?",
      fecha: "Hoy 08:30 AM",
      respondido: false,
      sentiment: "Interés Alto",
    },
  ];

  it("debe filtrar consultas por red social específica", () => {
    const igFeed = sampleFeed.filter((s) => s.plataforma === "INSTAGRAM");
    const liFeed = sampleFeed.filter((s) => s.plataforma === "LINKEDIN");

    expect(igFeed.length).toBe(1);
    expect(igFeed[0].remitente).toBe("Julián Albarracín");
    expect(liFeed.length).toBe(1);
    expect(liFeed[0].remitente).toBe("Mariana Soria");
  });

  it("debe calcular la cantidad de mensajes pendientes de respuesta", () => {
    const unreadCount = sampleFeed.filter((s) => !s.respondido).length;
    expect(unreadCount).toBe(3);
  });

  it("debe convertir un mensaje social en un Lead comercial estructurado", () => {
    const convertToLead = (interaction: SocialInteraction): Lead => {
      const originMap: Record<SocialPlatform, Lead["origen"]> = {
        FACEBOOK: "Facebook Ads",
        INSTAGRAM: "Instagram DM",
        LINKEDIN: "LinkedIn",
        X_TWITTER: "X (Twitter)",
        WHATSAPP: "WhatsApp",
      };

      return {
        id: `lead-conv-${Date.now()}`,
        nombre: interaction.remitente,
        empresa: interaction.handle,
        email: "",
        telefono: "",
        servicioInteres: "UX_UI",
        estado: "NUEVO",
        valorEstimado: 2500,
        moneda: "USD",
        origen: originMap[interaction.plataforma],
        notas: `Consulta recibida por ${interaction.plataforma}: "${interaction.contenido}"`,
        prioridad: "Alta",
        createdAt: "Recién convertido",
        tiempoSinContactoHoras: 0,
      };
    };

    const newLead = convertToLead(sampleFeed[1]);

    expect(newLead.nombre).toBe("Sofía Valenzuela");
    expect(newLead.origen).toBe("Facebook Ads");
    expect(newLead.estado).toBe("NUEVO");
    expect(newLead.valorEstimado).toBe(2500);
    expect(newLead.prioridad).toBe("Alta");
  });
});
