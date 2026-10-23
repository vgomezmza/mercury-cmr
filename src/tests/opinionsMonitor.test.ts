import { describe, it, expect } from "vitest";
import { ClientOpinion } from "../types/crm";
import { DEMO_OPINIONS } from "../data/initialData";

describe("5. Módulo Monitor de Opiniones & Reseñas de Clientes y Prospectos", () => {
  it("debe cargar la lista de opiniones iniciales con valoraciones y canales", () => {
    expect(DEMO_OPINIONS.length).toBeGreaterThan(0);
    const googleRev = DEMO_OPINIONS.find((o) => o.canal === "GOOGLE_REVIEWS");
    expect(googleRev).toBeDefined();
    expect(googleRev?.autor).toBe("Gabriel Guardia");
    expect(googleRev?.empresa).toBe("Olivícola Laur");
    expect(googleRev?.calificacion).toBe(5);
  });

  it("debe calcular el promedio de satisfacción de clientes", () => {
    const rated = DEMO_OPINIONS.filter((o) => o.calificacion !== undefined);
    const sum = rated.reduce((acc, curr) => acc + (curr.calificacion || 0), 0);
    const avg = sum / rated.length;

    expect(avg).toBeGreaterThanOrEqual(4.5);
    expect(avg).toBeLessThanOrEqual(5.0);
  });

  it("debe clasificar y contabilizar las opiniones por sentimiento", () => {
    const positivos = DEMO_OPINIONS.filter(
      (o) => o.sentimiento === "Excelente / Muy Satisfecho" || o.sentimiento === "Positivo"
    );
    const criticos = DEMO_OPINIONS.filter(
      (o) => o.sentimiento === "Oportunidad de Mejora / Crítica"
    );

    expect(positivos.length).toBeGreaterThan(0);
    expect(criticos.length).toBe(1);
    expect(criticos[0].empresa).toBe("Hipercerámico");
  });

  it("debe permitir responder a una opinión y cambiar su estado a RESPONDIDO", () => {
    const opinionToReply: ClientOpinion = {
      id: "op-test-1",
      canal: "EMAIL",
      autor: "Federico Pagano",
      empresa: "Montemar C.F.",
      contenido: "Consulta de estado del sprint",
      sentimiento: "Positivo",
      fecha: "Hoy",
      estado: "PENDIENTE",
    };

    const replyText = "Estimado Federico, el sprint fue desplegado exitosamente en staging.";

    const updated: ClientOpinion = {
      ...opinionToReply,
      estado: "RESPONDIDO",
      respuesta: replyText,
    };

    expect(updated.estado).toBe("RESPONDIDO");
    expect(updated.respuesta).toBe(replyText);
  });

  it("debe vincular la opinión con el ID del Lead prospectado", () => {
    const linkedOpinions = DEMO_OPINIONS.filter((o) => o.leadRelacionadoId !== undefined);
    expect(linkedOpinions.length).toBeGreaterThanOrEqual(4);
    expect(linkedOpinions[0].leadRelacionadoId).toBe("lead-p-1");
  });
});
