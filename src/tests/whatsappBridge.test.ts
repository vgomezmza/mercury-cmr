import { describe, it, expect } from "vitest";
import {
  validateWhatsAppSync,
  findLeadByWhatsAppContact,
} from "../lib/whatsappBridge";
import { INITIAL_LEADS } from "../data/initialData";

describe("WhatsApp Web Bridge Suite", () => {
  const validApiKey = "mercury_wa_sec_2026";

  it("rechaza sincronización sin apiKey válida", () => {
    const result = validateWhatsAppSync({
      apiKey: "clave_incorrecta",
      phone: "+542614001000",
      contactName: "Gabriel Guardia",
      messages: [{ sender: "cliente", text: "Hola" }],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("No autorizado");
  });

  it("acepta y procesa sincronización de mensajes válidos", () => {
    const result = validateWhatsAppSync({
      apiKey: validApiKey,
      phone: "+54 261 400-1000",
      contactName: "Gabriel Guardia",
      messages: [
        { sender: "cliente", text: "¿Tienen disponible el servicio de desarrollo web?" },
        { sender: "agente", text: "Hola Gabriel, sí, te comparto nuestra propuesta." },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.cleanPhone).toBe("542614001000");
    expect(result.messagesCount).toBe(2);
  });

  it("rechaza sincronización sin teléfono ni nombre de contacto", () => {
    const result = validateWhatsAppSync({
      apiKey: validApiKey,
      phone: "",
      contactName: "",
      messages: [{ sender: "cliente", text: "Hola" }],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Se requiere teléfono o nombre");
  });

  it("encuentra al cliente existente en la cartera de Mercury CRM por número de teléfono", () => {
    // Gabriel Guardia has phone "+54 261 400-1000" in INITIAL_LEADS
    const matched = findLeadByWhatsAppContact(INITIAL_LEADS, "542614001000");

    expect(matched).toBeDefined();
    expect(matched?.nombre).toBe("Gabriel Guardia");
    expect(matched?.empresa).toBe("Olivícola Laur");
  });

  it("encuentra al cliente existente por nombre si el número está incompleto", () => {
    const matched = findLeadByWhatsAppContact(INITIAL_LEADS, "", "Gabriel Guardia");

    expect(matched).toBeDefined();
    expect(matched?.nombre).toBe("Gabriel Guardia");
  });

  it("retorna undefined cuando el número no existe en la cartera", () => {
    const matched = findLeadByWhatsAppContact(INITIAL_LEADS, "+54 9 999 999-9999");
    expect(matched).toBeUndefined();
  });
});
