import type {
  CuerpoGuardarEscenario,
  EscenarioGuardado,
  FormularioSimulacion,
  ResultadoSimulacion,
} from "../types/simulacion";

export class ErrorHttp extends Error {
  constructor(
    mensaje: string,
    readonly status: number,
  ) {
    super(mensaje);
    this.name = "ErrorHttp";
  }
}

async function mensajeDesdeRespuesta(res: Response): Promise<string> {
  try {
    const cuerpo = (await res.json()) as { mensaje?: string };
    if (cuerpo.mensaje) return cuerpo.mensaje;
  } catch {
    /* cuerpo no JSON */
  }
  return `No se pudo completar la solicitud (HTTP ${res.status}).`;
}

async function parsear<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new ErrorHttp(await mensajeDesdeRespuesta(res), res.status);
  }
  return (await res.json()) as T;
}

export async function listarEscenarios(): Promise<EscenarioGuardado[]> {
  const res = await fetch("/api/escenarios");
  return parsear<EscenarioGuardado[]>(res);
}

export async function crearSimulacion(
  formulario: FormularioSimulacion,
): Promise<ResultadoSimulacion> {
  const res = await fetch("/api/simulaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formulario }),
  });
  return parsear<ResultadoSimulacion>(res);
}

export async function guardarEscenario(
  cuerpo: CuerpoGuardarEscenario,
): Promise<EscenarioGuardado> {
  const res = await fetch("/api/escenarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  return parsear<EscenarioGuardado>(res);
}
