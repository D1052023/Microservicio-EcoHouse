import {
  PORCENTAJE_CUOTA_MINIMO,
  RATIO_APORTE_MINIMO,
  type AlertaValidacion,
  type FormularioSimulacion,
} from "../types/simulacion";
import { formatearCOP } from "./formato";

export function aporteMinimoRequerido(ingresoMensual: number): number {
  return Math.ceil(ingresoMensual * RATIO_APORTE_MINIMO);
}

export function cumpleReglaAporteMinimo(
  ingresoMensual: number,
  aportePeriodico: number,
): boolean {
  if (ingresoMensual <= 0) return false;
  return aportePeriodico >= aporteMinimoRequerido(ingresoMensual);
}

export function mensajeReglaAporteMinimo(ingresoMensual: number): string {
  const minimo = aporteMinimoRequerido(ingresoMensual);
  return `El aporte periódico debe ser de al menos el 5% de tus ingresos (${formatearCOP(minimo)})`;
}

export function validarFormulario(form: FormularioSimulacion): AlertaValidacion[] {
  const alertas: AlertaValidacion[] = [];

  if (form.ingresoMensual <= 0) {
    alertas.push({
      id: "ingreso",
      tipo: "error",
      mensaje: "El ingreso mensual debe ser mayor a cero.",
    });
  }

  if (form.ahorroInicial < 0) {
    alertas.push({
      id: "ahorro",
      tipo: "error",
      mensaje: "El ahorro inicial no puede ser negativo.",
    });
  }

  if (form.valorInmueble <= 0) {
    alertas.push({
      id: "inmueble",
      tipo: "error",
      mensaje: "El valor del inmueble debe ser mayor a cero.",
    });
  }

  if (form.porcentajeCuotaInicial < PORCENTAJE_CUOTA_MINIMO) {
    alertas.push({
      id: "cuota",
      tipo: "error",
      mensaje: `La cuota inicial no puede ser inferior al ${PORCENTAJE_CUOTA_MINIMO}% del valor del inmueble.`,
    });
  }

  if (!cumpleReglaAporteMinimo(form.ingresoMensual, form.aportePeriodico)) {
    alertas.push({
      id: "aporte-minimo",
      tipo: "error",
      mensaje: mensajeReglaAporteMinimo(form.ingresoMensual),
    });
  }

  return alertas;
}

export function formularioEsValido(form: FormularioSimulacion): boolean {
  return validarFormulario(form).every((alerta) => alerta.tipo !== "error");
}
