import express from "express";
import cors from "cors";
import { calcularSimulacion } from "../src/lib/simulacion.ts";
import { validarFormulario, validarGuardadoEscenario } from "../src/lib/validacion.ts";
import type { CuerpoGuardarEscenario, FormularioSimulacion } from "../src/types/simulacion.ts";
import { HttpError, manejadorErrores } from "./httpError.ts";
import type { RepositorioEscenarios } from "./repositorio.ts";

function leerFormulario(body: unknown): FormularioSimulacion {
  const formulario = (body as { formulario?: FormularioSimulacion } | null)?.formulario;
  if (!formulario || typeof formulario !== "object") {
    throw new HttpError(400, "El cuerpo debe incluir el formulario de simulación.");
  }
  return formulario;
}

export function crearApp(repositorio: RepositorioEscenarios) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/salud", (_req, res) => {
    res.json({ ok: true, servicio: "ecohouse-simulacion" });
  });

  app.post("/api/simulaciones", (req, res, next) => {
    try {
      const formulario = leerFormulario(req.body);
      const errores = validarFormulario(formulario).filter((alerta) => alerta.tipo === "error");
      if (errores.length > 0) {
        throw new HttpError(400, errores[0].mensaje, errores);
      }
      res.json(calcularSimulacion(formulario));
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/escenarios", async (_req, res, next) => {
    try {
      res.json(await repositorio.listar());
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/escenarios/:id", async (req, res, next) => {
    try {
      const escenario = await repositorio.obtener(req.params.id);
      if (!escenario) {
        throw new HttpError(404, "No se encontró el escenario solicitado.");
      }
      res.json(escenario);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/escenarios", async (req, res, next) => {
    try {
      const formulario = leerFormulario(req.body);
      const { escenarioId, planAlternativoId } = (req.body ?? {}) as CuerpoGuardarEscenario;
      const errores = validarGuardadoEscenario(formulario, planAlternativoId).filter(
        (alerta) => alerta.tipo === "error",
      );
      if (errores.length > 0) {
        throw new HttpError(400, errores[0].mensaje, errores);
      }

      const resultado = calcularSimulacion(formulario, escenarioId);
      const guardado = await repositorio.guardar({
        id: resultado.escenarioId,
        fechaIso: new Date().toISOString(),
        formulario,
        meses: resultado.meses,
        planAlternativoId,
      });
      res.status(201).json(guardado);
    } catch (err) {
      next(err);
    }
  });

  app.use(manejadorErrores);
  return app;
}
