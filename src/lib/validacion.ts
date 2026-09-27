import {
  PORCENTAJE_CUOTA_MINIMO,
  RATIO_APORTE_MINIMO,
  UMBRAL_MAXIMO_MESES,
  type AlertaValidacion,
  type FormularioSimulacion,
} from "../types/simulacion";
import { formatearCOP } from "./formato";
import { calcularSimulacion } from "./simulacion";

/**
 * Calcula el aporte periódico mínimo exigido (5% del ingreso).
 *
 * @param ingresoMensual - Ingreso neto mensual en COP.
 * @returns Mínimo en COP, redondeado hacia arriba.
 */
export function aporteMinimoRequerido(ingresoMensual: number): number {
  return Math.ceil(ingresoMensual * RATIO_APORTE_MINIMO);
}

/**
 * Regla de negocio: el aporte periódico no puede ser inferior al 5% del ingreso mensual.
 *
 * @param ingresoMensual - Ingreso neto mensual en COP.
 * @param aportePeriodico - Aporte por periodo (mensual o quincenal) en COP.
 * @returns `true` si cumple la regla; `false` si el ingreso no es positivo o el aporte es insuficiente.
 */
export function cumpleReglaAporteMinimo(
  ingresoMensual: number,
  aportePeriodico: number,
): boolean {
  if (!Number.isFinite(ingresoMensual) || ingresoMensual <= 0) return false;
  if (!Number.isFinite(aportePeriodico) || aportePeriodico < 0) return false;
  return aportePeriodico >= aporteMinimoRequerido(ingresoMensual);
}

/**
 * Mensaje de error en español para la regla del 5%.
 *
 * @param ingresoMensual - Ingreso neto mensual en COP, usado para calcular el mínimo.
 */
export function mensajeReglaAporteMinimo(ingresoMensual: number): string {
  const minimo = aporteMinimoRequerido(ingresoMensual);
  return `El aporte periódico debe ser de al menos el 5% de tus ingresos (${formatearCOP(minimo)})`;
}

/**
 * Mensaje de error cuando el horizonte de ahorro supera el máximo razonable (15 años).
 *
 * @param meses - Tiempo estimado de ahorro en meses calendario.
 */
export function mensajeHorizonteMaximo(meses: number): string {
  const anios = Math.floor(UMBRAL_MAXIMO_MESES / 12);
  return `El tiempo estimado supera ${anios} años (${UMBRAL_MAXIMO_MESES} meses; tu plan actual: ${meses} meses). Debes revisar un plan alternativo antes de guardar el escenario.`;
}

/**
 * Indica si el horizonte de ahorro supera el umbral máximo para persistir un escenario.
 *
 * @param meses - Tiempo estimado en meses.
 */
export function superaHorizonteMaximo(meses: number): boolean {
  return meses > UMBRAL_MAXIMO_MESES;
}

function esNumeroValido(valor: number): boolean {
  return Number.isFinite(valor);
}

/**
 * Valida el formulario de simulación (montos en COP, cuota mínima 10%, regla del 5%).
 * No sustituye el umbral de 15 años: ese se evalúa sobre el resultado calculado.
 *
 * @param form - Campos del escenario.
 * @returns Alertas de tipo `error` listas para `PanelAlertas`.
 */
export function validarFormulario(form: FormularioSimulacion): AlertaValidacion[] {
  const alertas: AlertaValidacion[] = [];

  if (!esNumeroValido(form.ingresoMensual) || form.ingresoMensual < 0) {
    alertas.push({
      id: "ingreso-numerico",
      tipo: "error",
      mensaje: "El ingreso mensual debe ser un número válido y no negativo.",
    });
  } else if (form.ingresoMensual <= 0) {
    alertas.push({
      id: "ingreso",
      tipo: "error",
      mensaje: "El ingreso mensual debe ser mayor a cero.",
    });
  }

  if (!esNumeroValido(form.ahorroInicial) || form.ahorroInicial < 0) {
    alertas.push({
      id: "ahorro",
      tipo: "error",
      mensaje: "El ahorro inicial no puede ser negativo ni no numérico.",
    });
  }

  if (!esNumeroValido(form.aportePeriodico) || form.aportePeriodico < 0) {
    alertas.push({
      id: "aporte-numerico",
      tipo: "error",
      mensaje: "El aporte periódico debe ser un número válido y no negativo.",
    });
  }

  if (!esNumeroValido(form.valorInmueble) || form.valorInmueble < 0) {
    alertas.push({
      id: "inmueble-numerico",
      tipo: "error",
      mensaje: "El valor del inmueble debe ser un número válido y no negativo.",
    });
  } else if (form.valorInmueble <= 0) {
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

  if (
    esNumeroValido(form.ingresoMensual) &&
    esNumeroValido(form.aportePeriodico) &&
    !cumpleReglaAporteMinimo(form.ingresoMensual, form.aportePeriodico)
  ) {
    alertas.push({
      id: "aporte-minimo",
      tipo: "error",
      mensaje: mensajeReglaAporteMinimo(form.ingresoMensual),
    });
  }

  return alertas;
}

/**
 * @param form - Campos del escenario.
 * @returns `true` si no hay errores de formulario (el horizonte de 15 años se valida aparte).
 */
export function formularioEsValido(form: FormularioSimulacion): boolean {
  return validarFormulario(form).every((alerta) => alerta.tipo !== "error");
}

/**
 * Validación de persistencia (cliente y API): formulario + umbral de 15 años.
 * Si el plan supera `UMBRAL_MAXIMO_MESES`, exige `planAlternativoId` de un plan existente.
 *
 * @param form - Campos del escenario.
 * @param planAlternativoId - Identificador del plan revisado (`acelerado`, `cuota-20`, etc.).
 */
export function validarGuardadoEscenario(
  form: FormularioSimulacion,
  planAlternativoId?: string,
): AlertaValidacion[] {
  const alertas = validarFormulario(form);
  if (alertas.some((alerta) => alerta.tipo === "error")) return alertas;

  const resultado = calcularSimulacion(form);
  if (!superaHorizonteMaximo(resultado.meses)) return alertas;

  if (!planAlternativoId) {
    alertas.push({
      id: "horizonte-maximo",
      tipo: "error",
      mensaje: mensajeHorizonteMaximo(resultado.meses),
    });
    return alertas;
  }

  const plan = resultado.planes.find((item) => item.id === planAlternativoId);
  if (!plan) {
    alertas.push({
      id: "plan-invalido",
      tipo: "error",
      mensaje: "El plan alternativo seleccionado no es válido para este escenario.",
    });
  }

  return alertas;
}

/**
 * @param form - Campos del escenario.
 * @param planAlternativoId - Plan revisado, obligatorio si el horizonte supera 15 años.
 */
export function puedeGuardarEscenario(
  form: FormularioSimulacion,
  planAlternativoId?: string,
): boolean {
  return !validarGuardadoEscenario(form, planAlternativoId).some(
    (alerta) => alerta.tipo === "error",
  );
}
