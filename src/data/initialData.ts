import {
  Lead,
  SocialInteraction,
  Retainer,
  Project,
  EmailChannelConfig,
  SocialChannelsConfig,
  ClientOpinion,
  User,
} from "../types/crm";
import importedLeads from "./importedLeads.json";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-1",
    nombre: "Víctor (Director)",
    email: "victor@mercurycad.com.ar",
    password: "mercury2026",
    rol: "ADMIN",
    cargo: "Director General & Fundador",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    activo: true,
    ultimoAcceso: "Hoy, hace 5 minutos",
  },
  {
    id: "usr-2",
    nombre: "Mariana Soler",
    email: "ventas@mercurycad.com.ar",
    password: "comercial2026",
    rol: "COMERCIAL",
    cargo: "Líder de Ventas & Cuentas Clave",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    activo: true,
    ultimoAcceso: "Hoy, 10:15 AM",
  },
  {
    id: "usr-3",
    nombre: "Lucas Benítez",
    email: "pm@mercurycad.com.ar",
    password: "pm2026",
    rol: "PROJECT_MANAGER",
    cargo: "Project Manager & Tech Lead",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    activo: true,
    ultimoAcceso: "Ayer, 18:40",
  },
  {
    id: "usr-4",
    nombre: "Sofía Rossi",
    email: "marketing@mercurycad.com.ar",
    password: "mkt2026",
    rol: "COMERCIAL",
    cargo: "Especialista en Growth & Social Ads",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    activo: true,
    ultimoAcceso: "Hace 2 días",
  },
];

export const INITIAL_LEADS: Lead[] = importedLeads as Lead[];

export const INITIAL_SOCIAL_FEED: SocialInteraction[] = [];

export const INITIAL_RETAINERS: Retainer[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const DEFAULT_EMAIL_CONFIG: EmailChannelConfig = {
  email: "info@mercurycad.com.ar",
  incomingServer: "mail.mercurycad.com.ar",
  incomingPort: 993,
  incomingSecurity: "SSL/TLS",
  outgoingServer: "mail.mercurycad.com.ar",
  outgoingPort: 465,
  outgoingSecurity: "SSL/TLS",
  username: "info@mercurycad.com.ar",
  password: "••••••••••••",
  syncIntervalMinutes: 5,
  active: true,
};

export const DEFAULT_SOCIAL_CONFIG: SocialChannelsConfig = {
  meta: {
    appId: "982341902847120",
    pageId: "mercurycreationandesign",
    instagramAccountId: "mercurycreationandesign",
    pageToken: "EAAX...valid_token",
    active: true,
  },
  linkedIn: {
    clientId: "86xy491a0b3c",
    orgId: "mercury-creation-and-design",
    accessToken: "AQV...linked_token",
    active: true,
  },
  xTwitter: {
    apiKey: "x_api_live_k82190",
    bearerToken: "AAAA...bearer_v2",
    handle: "@mercurycad_ar",
    active: true,
  },
  googleBusiness: {
    locationId: "loc_mendoza_mercury_cad",
    active: true,
  },
};

export const INITIAL_OPINIONS: ClientOpinion[] = [];

// Demo and test fixtures used for automated unit tests
export const DEMO_RETAINERS: Retainer[] = [
  {
    id: "ret-1",
    clienteNombre: "Carlos Mendoza",
    empresa: "Winery Experience Tour",
    servicio: "Mantenimiento Web Proactivo & Seguridad",
    cuotaMensual: 450,
    moneda: "USD",
    diaCobro: 5,
    proximaFecha: "05/11/2026",
    estado: "ACTIVO",
  },
  {
    id: "ret-2",
    clienteNombre: "Agustina Paz",
    empresa: "Moda Andina E-Shop",
    servicio: "Gestión Integral Google & Meta Ads",
    cuotaMensual: 750,
    moneda: "USD",
    diaCobro: 1,
    proximaFecha: "01/11/2026",
    estado: "ACTIVO",
  },
  {
    id: "ret-3",
    clienteNombre: "Gonzalo Ramos",
    empresa: "Inmobiliaria Valle de Uco",
    servicio: "Mantenimiento Web + SEO Mensual",
    cuotaMensual: 550,
    moneda: "USD",
    diaCobro: 10,
    proximaFecha: "10/11/2026",
    estado: "ACTIVO",
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: "proj-1",
    nombre: "Rediseño Portal Fintech Andina",
    cliente: "Fintech Andina",
    faseActual: "Prototipo Figma",
    progreso: 65,
    figmaUrl: "https://figma.com/@mercurycad/fintech-andina",
    gitUrl: "https://github.com/mercurycad/fintech-platform",
    stagingUrl: "https://staging-fintech.mercurycad.com.ar",
    fechaEntrega: "15/11/2026",
  },
  {
    id: "proj-2",
    nombre: "E-Commerce Multitienda Cavas Cuyanas",
    cliente: "Cavas Cuyanas",
    faseActual: "Desarrollo Frontend",
    progreso: 40,
    figmaUrl: "https://figma.com/@mercurycad/cavas-cuyanas",
    fechaEntrega: "30/11/2026",
  },
];

export const DEMO_OPINIONS: ClientOpinion[] = [
  {
    id: "op-1",
    canal: "GOOGLE_REVIEWS",
    autor: "Gabriel Guardia",
    empresa: "Olivícola Laur",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    calificacion: 5,
    contenido: "Excelente trabajo del equipo de Mercury Creation & Design en el desarrollo y UX/UI de nuestra plataforma. Entendieron a la perfección la identidad de nuestra marca y los tiempos de carga son impecables.",
    sentimiento: "Excelente / Muy Satisfecho",
    fecha: "Hace 2 días",
    estado: "RESPONDIDO",
    leadRelacionadoId: "lead-p-1",
    leadRelacionadoNombre: "Gabriel Guardia (Olivícola Laur)",
    respuesta: "¡Muchas gracias Gabriel! Un orgullo acompañar el crecimiento digital de Olivícola Laur en Mendoza y el exterior.",
  },
  {
    id: "op-2",
    canal: "INSTAGRAM",
    autor: "Sofía Pescarmona",
    empresa: "Planta Uno",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    calificacion: 5,
    contenido: "Comentario en post @mercurycreationandesign: 'Felicitaciones chicos por el trabajo en el sistema de reservas y panel de control. Nuestros locales gastronómicos operan con muchísima más fluidez.'",
    sentimiento: "Excelente / Muy Satisfecho",
    fecha: "Ayer 18:30",
    estado: "RESPONDIDO",
    leadRelacionadoId: "lead-p-2",
    leadRelacionadoNombre: "Sofía Pescarmona (Planta Uno)",
    respuesta: "¡Gracias Sofía! Todo el equipo disfrutó mucho diseñar la experiencia UX de Planta Uno.",
  },
  {
    id: "op-3",
    canal: "EMAIL",
    autor: "Federico Pagano",
    empresa: "Montemar C.F.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    calificacion: 5,
    contenido: "Estimados directores de Mercury CAD: Les escribo para formalizar el visto bueno del comité sobre la entrega del sprint de onboarding digital y ciberseguridad. La tasa de conversión aumentó un 32% en el primer testeo.",
    sentimiento: "Positivo",
    fecha: "Hoy 09:40 AM",
    estado: "PENDIENTE",
    leadRelacionadoId: "lead-p-3",
    leadRelacionadoNombre: "Federico Pagano (Montemar C.F.)",
  },
  {
    id: "op-4",
    canal: "LINKEDIN",
    autor: "Patricia Serizola",
    empresa: "Anaia Wines",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    calificacion: 5,
    contenido: "Recomendación pública en LinkedIn: 'Trabajar con Mercury CAD en la integración de nuestro sistema de enoturismo y automatizaciones n8n fue la mejor decisión tecnológica del año. Profesionales, proactivos y orientados a resultados.'",
    sentimiento: "Excelente / Muy Satisfecho",
    fecha: "Hace 4 días",
    estado: "RESPONDIDO",
    leadRelacionadoId: "lead-p-4",
    leadRelacionadoNombre: "Patricia Serizola (Anaia Wines)",
    respuesta: "¡Gracias Patricia! Un placer trabajar con Anaia Wines.",
  },
  {
    id: "op-5",
    canal: "X_TWITTER",
    autor: "TechReviewer_Cuyo",
    empresa: "Mendoza Tech Community",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
    contenido: "Tweet: 'Probando la plataforma web desarrollada por @mercurycad_ar. Notoria optimización en Core Web Vitals y diseño responsive limpio. Gran nivel técnico en la provincia.'",
    sentimiento: "Positivo",
    fecha: "Hoy 11:15 AM",
    estado: "PENDIENTE",
  },
  {
    id: "op-6",
    canal: "EMAIL",
    autor: "Diego Pérez Colman",
    empresa: "Hipercerámico",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    calificacion: 4,
    contenido: "Hola equipo de soporte Mercury CAD: Notamos que en Safari móvil el filtro de cerámicos tarda 1 segundo más que en Chrome. ¿Podríamos coordinar un ajuste de caché en el próximo sprint?",
    sentimiento: "Oportunidad de Mejora / Crítica",
    fecha: "Hoy 08:20 AM",
    estado: "PENDIENTE",
    leadRelacionadoId: "lead-p-6",
    leadRelacionadoNombre: "Diego Pérez Colman (Hipercerámico)",
  },
];
