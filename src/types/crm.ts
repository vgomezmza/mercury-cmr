export type ServiceType =
  | "UX_UI"
  | "WEB_DEVELOPMENT"
  | "CUSTOM_SOFTWARE"
  | "META_GOOGLE_ADS"
  | "BRANDING"
  | "MONTHLY_MAINTENANCE";

export type LeadStatus =
  | "NUEVO"
  | "RELEVAMIENTO"
  | "PROPUESTA_ENVIADA"
  | "EN_NEGOCIACION"
  | "GANADO"
  | "PERDIDO";

export type UserRole = "ADMIN" | "COMERCIAL" | "PROJECT_MANAGER";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: UserRole;
  avatarUrl?: string;
  activo: boolean;
  ultimoAcceso?: string;
  cargo?: string;
}

export type SocialPlatform = "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "X_TWITTER" | "WHATSAPP";

export interface WhatsAppMessage {
  id: string;
  remitente: "cliente" | "agente";
  texto: string;
  fecha: string;
}

export interface SocialInteraction {
  id: string;
  plataforma: SocialPlatform;
  remitente: string;
  handle: string;
  avatarUrl?: string;
  contenido: string;
  fecha: string;
  respondido: boolean;
  leadId?: string;
  sentiment?: "Positivo" | "Neutro" | "Interés Alto";
}

export type VerificationStatus = "VERIFICADO" | "PENDIENTE" | "REQUIERE_ACTUALIZACION";

export interface Lead {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicioInteres: ServiceType;
  estado: LeadStatus;
  valorEstimado: number;
  moneda: "USD" | "ARS";
  origen: "Facebook Ads" | "Instagram DM" | "LinkedIn" | "X (Twitter)" | "Web MercuryCAD" | "Referido" | "WhatsApp";
  notas: string;
  prioridad: "Alta" | "Media" | "Baja";
  createdAt: string;
  tiempoSinContactoHoras?: number;
  verificacionEstado?: VerificationStatus;
  verificacionFecha?: string;
  verificacionNotas?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  asignadoAId?: string;
  asignadoANombre?: string;
  creadoPorId?: string;
  whatsappMensajes?: WhatsAppMessage[];
}

export interface Retainer {
  id: string;
  clienteNombre: string;
  empresa: string;
  servicio: string;
  cuotaMensual: number;
  moneda: "USD" | "ARS";
  diaCobro: number;
  proximaFecha: string;
  estado: "ACTIVO" | "PAUSADO" | "RENOVACION_PENDIENTE";
}

export interface Project {
  id: string;
  nombre: string;
  cliente: string;
  faseActual: "Wireframes" | "Prototipo Figma" | "Desarrollo Frontend" | "Desarrollo Backend" | "QA y Testing" | "Despliegue";
  progreso: number; // 0 - 100
  figmaUrl?: string;
  gitUrl?: string;
  stagingUrl?: string;
  fechaEntrega: string;
}

export interface EmailChannelConfig {
  email: string;
  incomingServer: string;
  incomingPort: number;
  incomingSecurity: "SSL/TLS" | "STARTTLS" | "None";
  outgoingServer: string;
  outgoingPort: number;
  outgoingSecurity: "SSL/TLS" | "STARTTLS" | "None";
  username: string;
  password?: string;
  syncIntervalMinutes: number;
  active: boolean;
}

export interface SocialChannelsConfig {
  meta: {
    appId: string;
    appSecret?: string;
    pageToken?: string;
    pageId: string;
    instagramAccountId: string;
    active: boolean;
  };
  linkedIn: {
    clientId: string;
    clientSecret?: string;
    orgId: string;
    accessToken?: string;
    active: boolean;
  };
  xTwitter: {
    apiKey: string;
    apiSecret?: string;
    bearerToken?: string;
    handle: string;
    active: boolean;
  };
  googleBusiness: {
    locationId: string;
    apiKey?: string;
    active: boolean;
  };
  whatsapp?: {
    apiKey: string;
    endpointUrl?: string;
    active: boolean;
    autoSync: boolean;
  };
}

export interface ClientOpinion {
  id: string;
  canal: "EMAIL" | "INSTAGRAM" | "FACEBOOK" | "LINKEDIN" | "X_TWITTER" | "GOOGLE_REVIEWS";
  autor: string;
  empresa?: string;
  avatarUrl?: string;
  calificacion?: number; // 1 to 5
  contenido: string;
  sentimiento: "Excelente / Muy Satisfecho" | "Positivo" | "Neutro" | "Oportunidad de Mejora / Crítica";
  fecha: string;
  estado: "PENDIENTE" | "RESPONDIDO" | "VINCULADO_LEAD";
  leadRelacionadoId?: string;
  leadRelacionadoNombre?: string;
  respuesta?: string;
}
