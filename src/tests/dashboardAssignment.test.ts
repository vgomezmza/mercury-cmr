import { describe, it, expect } from "vitest";
import { Lead, User } from "../types/crm";

describe("Dashboard & Lead Assignment System", () => {
  const adminUser: User = {
    id: "usr-admin",
    nombre: "Víctor (Director)",
    email: "victor@mercurycad.com.ar",
    rol: "ADMIN",
    activo: true,
  };

  const comercialUser1: User = {
    id: "usr-com-1",
    nombre: "Mariana Soler",
    email: "mariana@mercurycad.com.ar",
    rol: "COMERCIAL",
    activo: true,
  };

  const comercialUser2: User = {
    id: "usr-com-2",
    nombre: "Sofía Rossi",
    email: "sofia@mercurycad.com.ar",
    rol: "COMERCIAL",
    activo: true,
  };

  const sampleLeads: Lead[] = [
    {
      id: "l-1",
      nombre: "Carlos Gómez",
      empresa: "Bodega Mendoza",
      email: "carlos@bodega.com",
      telefono: "+54 261 400-0001",
      servicioInteres: "UX_UI",
      estado: "NUEVO",
      valorEstimado: 3500,
      moneda: "USD",
      origen: "LinkedIn",
      notas: "Interesado en rediseño web",
      prioridad: "Alta",
      createdAt: "2026-10-26",
      asignadoAId: "usr-com-1",
      asignadoANombre: "Mariana Soler",
      creadoPorId: "usr-admin", // Ceded by admin
    },
    {
      id: "l-2",
      nombre: "Lucía Fernández",
      empresa: "Andes Logística",
      email: "lucia@andes.com",
      telefono: "+54 261 400-0002",
      servicioInteres: "CUSTOM_SOFTWARE",
      estado: "PROPUESTA_ENVIADA",
      valorEstimado: 7200,
      moneda: "USD",
      origen: "Web MercuryCAD",
      notas: "Propuesta enviada ayer",
      prioridad: "Alta",
      createdAt: "2026-10-25",
      asignadoAId: "usr-com-1",
      asignadoANombre: "Mariana Soler",
      creadoPorId: "usr-com-1", // Created by Mariana from scratch
    },
    {
      id: "l-3",
      nombre: "Martín Castro",
      empresa: "Cuyo Tech",
      email: "martin@cuyotech.com",
      telefono: "+54 261 400-0003",
      servicioInteres: "WEB_DEVELOPMENT",
      estado: "EN_NEGOCIACION",
      valorEstimado: 4800,
      moneda: "USD",
      origen: "Instagram DM",
      notas: "En negociación final",
      prioridad: "Media",
      createdAt: "2026-10-20",
      asignadoAId: "usr-com-2",
      asignadoANombre: "Sofía Rossi",
      creadoPorId: "usr-com-2",
    },
    {
      id: "l-4",
      nombre: "Pedro Ortiz",
      empresa: "Fincas Andinas",
      email: "pedro@fincas.com",
      telefono: "+54 261 400-0004",
      servicioInteres: "BRANDING",
      estado: "RELEVAMIENTO",
      valorEstimado: 2500,
      moneda: "USD",
      origen: "Referido",
      notas: "Sin asignar todavía",
      prioridad: "Baja",
      createdAt: "2026-10-26",
      creadoPorId: "usr-admin",
    },
  ];

  it("filtra cartera para usuario comercial mostrando sólo clientes propios o asignados", () => {
    const marianaVisibleLeads = sampleLeads.filter(
      (l) => l.asignadoAId === comercialUser1.id || l.creadoPorId === comercialUser1.id
    );

    expect(marianaVisibleLeads.length).toBe(2);
    expect(marianaVisibleLeads.map((l) => l.id)).toEqual(["l-1", "l-2"]);
    // Should NOT see Sofía's or unassigned leads
    expect(marianaVisibleLeads.some((l) => l.id === "l-3")).toBe(false);
    expect(marianaVisibleLeads.some((l) => l.id === "l-4")).toBe(false);
  });

  it("calcula métricas de Dashboard correctamente para el usuario comercial", () => {
    const marianaLeads = sampleLeads.filter(
      (l) => l.asignadoAId === comercialUser1.id || l.creadoPorId === comercialUser1.id
    );

    const totalLeads = marianaLeads.length; // 2
    const potenciales = marianaLeads.filter(
      (l) => l.estado === "NUEVO" || l.estado === "RELEVAMIENTO"
    ).length; // 1 (l-1)
    const enNegociacion = marianaLeads.filter(
      (l) => l.estado === "PROPUESTA_ENVIADA" || l.estado === "EN_NEGOCIACION"
    ).length; // 1 (l-2)
    const pipelineUsd = marianaLeads.reduce((acc, curr) => acc + curr.valorEstimado, 0); // 3500 + 7200 = 10700

    const creadosPropios = marianaLeads.filter((l) => l.creadoPorId === comercialUser1.id).length; // 1
    const cedidosAdmin = marianaLeads.filter(
      (l) => l.asignadoAId === comercialUser1.id && l.creadoPorId !== comercialUser1.id
    ).length; // 1

    expect(totalLeads).toBe(2);
    expect(potenciales).toBe(1);
    expect(enNegociacion).toBe(1);
    expect(pipelineUsd).toBe(10700);
    expect(creadosPropios).toBe(1);
    expect(cedidosAdmin).toBe(1);
  });

  it("permite al administrador ver todos los clientes y filtrar por colaborador", () => {
    // Admin sees all 4
    expect(sampleLeads.length).toBe(4);

    // Filter by Mariana
    const marianaFilter = sampleLeads.filter((l) => l.asignadoAId === "usr-com-1");
    expect(marianaFilter.length).toBe(2);

    // Filter by Sofía
    const sofiaFilter = sampleLeads.filter((l) => l.asignadoAId === "usr-com-2");
    expect(sofiaFilter.length).toBe(1);

    // Filter unassigned
    const unassignedFilter = sampleLeads.filter((l) => !l.asignadoAId);
    expect(unassignedFilter.length).toBe(1);
    expect(unassignedFilter[0].id).toBe("l-4");
  });

  it("permite ceder / reasignar un cliente a otro colaborador", () => {
    let currentLeads = [...sampleLeads];

    // Admin cedes l-4 to Mariana
    currentLeads = currentLeads.map((l) =>
      l.id === "l-4"
        ? {
            ...l,
            asignadoAId: comercialUser1.id,
            asignadoANombre: comercialUser1.nombre,
          }
        : l
    );

    // Now Mariana has 3 leads
    const marianaUpdatedLeads = currentLeads.filter(
      (l) => l.asignadoAId === comercialUser1.id || l.creadoPorId === comercialUser1.id
    );

    expect(marianaUpdatedLeads.length).toBe(3);
    const reassigned = marianaUpdatedLeads.find((l) => l.id === "l-4");
    expect(reassigned).toBeDefined();
    expect(reassigned?.asignadoANombre).toBe("Mariana Soler");
  });

  it("asigna automáticamente al usuario activo cuando un comercial crea un cliente desde cero", () => {
    const newLeadFromComercial: Lead = {
      id: "l-new",
      nombre: "Esteban Quiroga",
      empresa: "Vinoteca Cuyo",
      email: "esteban@vinoteca.com",
      telefono: "+54 261 400-0005",
      servicioInteres: "META_GOOGLE_ADS",
      estado: "NUEVO",
      valorEstimado: 1800,
      moneda: "USD",
      origen: "LinkedIn",
      notas: "Cargado por Mariana",
      prioridad: "Media",
      createdAt: "Recién ingresado",
      creadoPorId: comercialUser1.id,
      asignadoAId: comercialUser1.id,
      asignadoANombre: comercialUser1.nombre,
    };

    expect(newLeadFromComercial.creadoPorId).toBe("usr-com-1");
    expect(newLeadFromComercial.asignadoAId).toBe("usr-com-1");
    expect(newLeadFromComercial.asignadoANombre).toBe("Mariana Soler");
  });
});
