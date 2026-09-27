import { describe, expect, it } from "vitest";
import request from "supertest";
import { crearApp } from "./app.ts";
import { crearRepositorioMemoria } from "./repositorio.ts";
import { VALORES_DEFAULT } from "../src/types/simulacion.ts";

describe("API EcoHouse", () => {
  const app = crearApp(crearRepositorioMemoria());

  it("responde el health check", async () => {
    const res = await request(app).get("/api/salud");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("rechaza simulación si se viola el 5%", async () => {
    const res = await request(app)
      .post("/api/simulaciones")
      .send({
        formulario: { ...VALORES_DEFAULT, ingresoMensual: 3_000_000, aportePeriodico: 50_000 },
      });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toContain("5%");
  });

  it("rechaza guardar un horizonte mayor a 15 años sin plan alternativo", async () => {
    const api = crearApp(crearRepositorioMemoria());
    const res = await request(api)
      .post("/api/escenarios")
      .send({ formulario: VALORES_DEFAULT });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toContain("15 años");
  });

  it("guarda el escenario cuando se revisó un plan alternativo", async () => {
    const api = crearApp(crearRepositorioMemoria());
    const res = await request(api)
      .post("/api/escenarios")
      .send({ formulario: VALORES_DEFAULT, planAlternativoId: "cuota-20" });
    expect(res.status).toBe(201);
    expect(res.body.planAlternativoId).toBe("cuota-20");
    expect(res.body.id).toBeTruthy();

    const listado = await request(api).get("/api/escenarios");
    expect(listado.status).toBe(200);
    expect(listado.body).toHaveLength(1);
  });

  it("responde 404 si el escenario no existe", async () => {
    const api = crearApp(crearRepositorioMemoria());
    const res = await request(api).get("/api/escenarios/no-existe");
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toBe("No se encontró el escenario solicitado.");
  });
});
