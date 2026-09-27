import type { ErrorRequestHandler } from "express";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    mensaje: string,
    readonly detalles?: unknown,
  ) {
    super(mensaje);
    this.name = "HttpError";
  }
}

export const manejadorErrores: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      mensaje: err.message,
      detalles: err.detalles,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    mensaje: "Ocurrió un error interno al procesar la solicitud.",
  });
};

