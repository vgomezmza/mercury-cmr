import { Lead } from "../types/crm";

export interface WhatsAppSyncPayload {
  apiKey: string;
  phone: string;
  contactName: string;
  messages: Array<{
    sender: "cliente" | "agente";
    text: string;
    timestamp?: string;
  }>;
}

export function validateWhatsAppSync(
  payload: WhatsAppSyncPayload,
  expectedApiKey: string = "mercury_wa_sec_2026"
) {
  if (payload.apiKey !== expectedApiKey) {
    return { success: false, error: "No autorizado. Token de WhatsApp API inválido." };
  }
  if (!payload.phone && !payload.contactName) {
    return { success: false, error: "Se requiere teléfono o nombre de contacto." };
  }
  const cleanPhone = (payload.phone || "").replace(/[^0-9]/g, "");
  return {
    success: true,
    cleanPhone,
    messagesCount: (payload.messages || []).length,
  };
}

export function findLeadByWhatsAppContact(
  leads: Lead[],
  phone: string,
  name?: string
): Lead | undefined {
  const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  return leads.find((l) => {
    const leadPhone = (l.telefono || "").replace(/[^0-9]/g, "");
    if (
      cleanPhone &&
      leadPhone &&
      (leadPhone.includes(cleanPhone) || cleanPhone.includes(leadPhone))
    ) {
      return true;
    }
    if (name && l.nombre.toLowerCase().includes(name.toLowerCase())) {
      return true;
    }
    return false;
  });
}
