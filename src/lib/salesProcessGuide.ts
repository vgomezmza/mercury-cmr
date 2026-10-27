import { Lead, LeadStatus, SalesChecklist } from "../types/crm";

export interface StageTask {
  key: keyof SalesChecklist;
  label: string;
  hint: string;
}

export interface StageGuideInfo {
  status: LeadStatus;
  stepNumber: number;
  name: string;
  shortName: string;
  badgeColor: string;
  progressPercent: number;
  objective: string;
  instructions: string[];
  tasks: StageTask[];
  recommendedAction: string;
  nextStatus: LeadStatus | null;
  previousStatus: LeadStatus | null;
}

export const SALES_STAGES_GUIDE: Record<LeadStatus, StageGuideInfo> = {
  NUEVO: {
    status: "NUEVO",
    stepNumber: 1,
    name: "Paso 1: Calificación y Primer Contacto",
    shortName: "1. Calificación",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    progressPercent: 20,
    objective: "Validar la identidad del contacto clave y abrir canal de comunicación directo por WhatsApp o Correo.",
    instructions: [
      "Revisa las redes sugeridas (LinkedIn, Instagram) para confirmar el rol de decisión.",
      "Envía un primer mensaje cordial presentándote desde Mercury CAD y ofreciendo una breve llamada de 10 minutos.",
      "Confirma si el contacto tiene una necesidad activa de UX/UI, Desarrollo Web, Software o Pauta Digital.",
    ],
    tasks: [
      {
        key: "contactoValidado",
        label: "Decisor y teléfono de WhatsApp validados",
        hint: "Confirmar que el número es correcto y atiende la persona indicada.",
      },
      {
        key: "radarRedesRevisado",
        label: "Presencia digital y redes auditadas",
        hint: "Revisar perfiles de LinkedIn e Instagram corporativos para entender su negocio.",
      },
      {
        key: "primerMensajeEnviado",
        label: "Primer mensaje de prospección enviado",
        hint: "Iniciar conversación ofreciendo asesoramiento personalizado sin presiones.",
      },
    ],
    recommendedAction: "Enviar mensaje de bienvenida por WhatsApp",
    nextStatus: "RELEVAMIENTO",
    previousStatus: null,
  },

  RELEVAMIENTO: {
    status: "RELEVAMIENTO",
    stepNumber: 2,
    name: "Paso 2: Diagnóstico de Necesidades y Dolores",
    shortName: "2. Relevamiento",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    progressPercent: 40,
    objective: "Descubrir a fondo qué problema busca solucionar el cliente, alcance técnico requerido y presupuesto estimativo.",
    instructions: [
      "Realiza una videollamada o reunión de diagnóstico de 30 minutos.",
      "Identifica dolores concretos: web lenta, falta de conversiones, software obsoleto o necesidad de imagen corporativa.",
      "Anota los requerimientos funcionales para elaborar la cotización CPQ a medida.",
    ],
    tasks: [
      {
        key: "reunionDiagnosticoRealizada",
        label: "Reunión o llamada de relevamiento efectuada",
        hint: "Charla en profundidad con el decisor para entender sus metas comerciales.",
      },
      {
        key: "doloresYAlcanceDefinidos",
        label: "Alcance funcional y entregables definidos",
        hint: "Documentar qué pantallas, módulos de backend o campañas se necesitan.",
      },
      {
        key: "presupuestoEstimadoValidado",
        label: "Rango presupuestario confirmado",
        hint: "Validar que el cliente cuenta con presupuesto acorde a tarifas de Mercury CAD.",
      },
    ],
    recommendedAction: "Abrir Cotizador CPQ y generar presupuesto",
    nextStatus: "PROPUESTA_ENVIADA",
    previousStatus: "NUEVO",
  },

  PROPUESTA_ENVIADA: {
    status: "PROPUESTA_ENVIADA",
    stepNumber: 3,
    name: "Paso 3: Presentación de Propuesta y Cotización",
    shortName: "3. Propuesta CPQ",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    progressPercent: 60,
    objective: "Armar la cotización oficial en el CPQ de Mercury CAD y presentarla formalmente al cliente defendiendo el ROI.",
    instructions: [
      "Genera la cotización detallada desglosando diseño UX/UI, desarrollo y mantenimiento.",
      "Envía la propuesta en formato digital o PDF acompañado de un resumen en video o mensaje explicativo.",
      "Coordina una sesión de 15 minutos para resolver inquietudes técnicas y presupuestarias.",
    ],
    tasks: [
      {
        key: "propuestaCpqGenerada",
        label: "Cotización formal generada en Cotizador CPQ",
        hint: "Crear el presupuesto con módulos, horas y valor final acordado.",
      },
      {
        key: "propuestaEnviadaCliente",
        label: "Propuesta remitida al cliente por WhatsApp / Correo",
        hint: "Enviar el documento formal con mensaje de seguimiento.",
      },
      {
        key: "demoOPresentacionEfectuada",
        label: "Presentación o demostración de alcance realizada",
        hint: "Mostrar casos de éxito similares de Mercury CAD en Mendoza y Argentina.",
      },
    ],
    recommendedAction: "Hacer seguimiento de propuesta a las 48hs",
    nextStatus: "EN_NEGOCIACION",
    previousStatus: "RELEVAMIENTO",
  },

  EN_NEGOCIACION: {
    status: "EN_NEGOCIACION",
    stepNumber: 4,
    name: "Paso 4: Negociación y Cierre de Condiciones",
    shortName: "4. Negociación",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    progressPercent: 80,
    objective: "Superar objeciones, acordar formas de pago (anticipo + hitos) y conseguir el acuerdo definitivo de la dirección.",
    instructions: [
      "Escucha con atención objeciones de costo o plazos y ofrece alternativas (ej. pago en 2 o 3 cuotas).",
      "Confirma los plazos de inicio del equipo de desarrollo y diseño de Mercury CAD.",
      "Solicita la aprobación escrita (orden de compra, email o mensaje de confirmación).",
    ],
    tasks: [
      {
        key: "objecionesResueltas",
        label: "Objeciones técnicas y de precio superadas",
        hint: "Ajustar alcance o formas de financiación si fue necesario.",
      },
      {
        key: "terminosYFormasPagoAcordados",
        label: "Esquema de pagos pactado (50% anticipo)",
        hint: "Acordar método de pago (transferencia bancaria, moneda USD/ARS).",
      },
      {
        key: "decisionMakerAprobado",
        label: "Aprobación final del directorio / decisor confirmada",
        hint: "El cliente dio luz verde formal para comenzar el proyecto.",
      },
    ],
    recommendedAction: "Formalizar acuerdo y solicitar anticipo",
    nextStatus: "GANADO",
    previousStatus: "PROPUESTA_ENVIADA",
  },

  GANADO: {
    status: "GANADO",
    stepNumber: 5,
    name: "Paso 5: Venta Cerrada y Pase a Producción",
    shortName: "5. Ganado 🎉",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    progressPercent: 100,
    objective: "¡Venta concretada! Emitir factura de anticipo, dar la bienvenida oficial y transferir el cliente a Gestión de Proyectos.",
    instructions: [
      "Celebra con el equipo de ventas: ¡objetivo alcanzado!",
      "Emite la factura de anticipo según los términos acordados.",
      "Crea el proyecto en la sección de Proyectos y Retainers para que el equipo técnico empiece de inmediato.",
    ],
    tasks: [
      {
        key: "contratoFirmadoOConfirmado",
        label: "Contrato / aceptación formal confirmada por escrito",
        hint: "Documentación legal y comercial firmada y archivada.",
      },
      {
        key: "anticipoFacturado",
        label: "Anticipo de inicio facturado / cobrado",
        hint: "Comprobante de transferencia o pago registrado en tesorería.",
      },
      {
        key: "paseAProyectoEfectuado",
        label: "Pase a Proyecto o Abono Mensual creado en el sistema",
        hint: "Transferir a producción para inicio de Wireframes o campañas.",
      },
    ],
    recommendedAction: "Crear Proyecto en curso o Asignar Abono Retainer",
    nextStatus: null,
    previousStatus: "EN_NEGOCIACION",
  },

  PERDIDO: {
    status: "PERDIDO",
    stepNumber: 0,
    name: "Prospecto No Concretado",
    shortName: "Perdido",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    progressPercent: 0,
    objective: "Registrar motivo de pérdida para mejorar la tasa de conversión futura y programar recontacto a 6 meses.",
    instructions: [
      "Documenta en las notas por qué no se concretó la venta (precio, tiempos, competidor, postergación).",
      "Mantén una relación cordial: muchos clientes regresan más adelante cuando otros proveedores fallan.",
    ],
    tasks: [],
    recommendedAction: "Programar recordatorio de recontacto a 6 meses",
    nextStatus: "NUEVO",
    previousStatus: null,
  },
};

export const ORDERED_SALES_STAGES: LeadStatus[] = [
  "NUEVO",
  "RELEVAMIENTO",
  "PROPUESTA_ENVIADA",
  "EN_NEGOCIACION",
  "GANADO",
];

/**
 * Calcula el progreso general del proceso de ventas para un lead.
 */
export function calculateSalesProgress(lead: Lead): {
  progressPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
  stageCompletedTasksCount: number;
  stageTotalTasksCount: number;
} {
  const currentStageInfo = SALES_STAGES_GUIDE[lead.estado] || SALES_STAGES_GUIDE.NUEVO;
  const checklist = lead.checklistVenta || {};

  // All 15 tasks across the 5 main stages
  const allTasks: (keyof SalesChecklist)[] = [
    "contactoValidado",
    "radarRedesRevisado",
    "primerMensajeEnviado",
    "reunionDiagnosticoRealizada",
    "doloresYAlcanceDefinidos",
    "presupuestoEstimadoValidado",
    "propuestaCpqGenerada",
    "propuestaEnviadaCliente",
    "demoOPresentacionEfectuada",
    "objecionesResueltas",
    "terminosYFormasPagoAcordados",
    "decisionMakerAprobado",
    "contratoFirmadoOConfirmado",
    "anticipoFacturado",
    "paseAProyectoEfectuado",
  ];

  const completedTasksCount = allTasks.filter((k) => !!checklist[k]).length;
  const totalTasksCount = allTasks.length;

  const currentStageTasks = currentStageInfo.tasks;
  const stageCompletedTasksCount = currentStageTasks.filter((t) => !!checklist[t.key]).length;
  const stageTotalTasksCount = currentStageTasks.length;

  if (lead.estado === "GANADO") {
    return {
      progressPercent: 100,
      completedTasksCount,
      totalTasksCount,
      stageCompletedTasksCount,
      stageTotalTasksCount,
    };
  }

  if (lead.estado === "PERDIDO") {
    return {
      progressPercent: 0,
      completedTasksCount,
      totalTasksCount,
      stageCompletedTasksCount: 0,
      stageTotalTasksCount: 0,
    };
  }

  // Base percent for current stage + bonus for completed tasks in this stage
  const basePercent = currentStageInfo.progressPercent - 20;
  const taskBonus = stageTotalTasksCount > 0 ? (stageCompletedTasksCount / stageTotalTasksCount) * 20 : 0;
  const progressPercent = Math.min(95, Math.round(basePercent + taskBonus));

  return {
    progressPercent: Math.max(10, progressPercent),
    completedTasksCount,
    totalTasksCount,
    stageCompletedTasksCount,
    stageTotalTasksCount,
  };
}

/**
 * Plantilla de mensaje de bienvenida para WhatsApp según el servicio de interés.
 */
export function getWhatsAppWelcomeTemplate(lead: Lead, executiveName?: string): string {
  const asesor = executiveName ? `Soy ${executiveName} del equipo de Mercury CAD` : "Te contacto desde Mercury CAD";
  const empresa = lead.empresa ? ` en ${lead.empresa}` : "";
  const servicio = lead.servicioInteres.replace("_", " ").toLowerCase();

  return `Hola ${lead.nombre}, ¿cómo estás? ${asesor}. Vi el interés que tienen${empresa} en servicios de ${servicio}. ¿Te vendría bien una breve llamada de 10 minutos esta semana para contarte cómo podemos ayudarlos a potenciar sus resultados digitales? Quedo a tu disposición.`;
}

/**
 * Plantilla de mensaje para envío de cotización CPQ por WhatsApp.
 */
export function getWhatsAppProposalTemplate(lead: Lead, executiveName?: string): string {
  return `Estimado/a ${lead.nombre}, un gusto saludarte. Ya tenemos lista la propuesta técnica y presupuestaria de Mercury CAD para ${lead.empresa}. Estimamos una inversión de $${lead.valorEstimado.toLocaleString("es-AR")} ${lead.moneda} con plazos de entrega garantizados. ¿Cuándo te resultaría cómodo que coordinemos una videollamada para presentarte los detalles y resolver cualquier duda?`;
}
