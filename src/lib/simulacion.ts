import {
  FACTOR_PLAN_ACELERADO,
  MAX_MESES_PROYECCION,
  UMBRAL_MESES_PLAN_ACELERADO,
  type FormularioSimulacion,
  type PlanAlternativo,
  type PuntoProyeccion,
  type ResultadoSimulacion,
} from "../types/simulacion";
import { generarIdEscenario } from "./formato";

export function calcularCuotaInicial(
  valorInmueble: number,
  porcentajeCuotaInicial: number,
): number {
  return valorInmueble * (porcentajeCuotaInicial / 100);
}

export function aporteMensualEquivalente(
  aportePeriodico: number,
  frecuencia: FormularioSimulacion["frecuencia"],
): number {
  return frecuencia === "Quincenal" ? aportePeriodico * 2 : aportePeriodico;
}

export function calcularMesesParaMeta(
  faltante: number,
  ahorroMensual: number,
): number {
  if (faltante <= 0) return 0;
  if (ahorroMensual <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil(faltante / ahorroMensual);
}

function construirProyeccion(
  ahorroInicial: number,
  ahorroMensual: number,
  meta: number,
  meses: number,
): PuntoProyeccion[] {
  const horizonte = Number.isFinite(meses)
    ? Math.min(Math.max(meses, 1), MAX_MESES_PROYECCION)
    : MAX_MESES_PROYECCION;

  const puntos: PuntoProyeccion[] = [
    {
      mes: 0,
      etiqueta: "Inicio",
      acumulado: Math.min(ahorroInicial, meta),
      meta,
    },
  ];

  let acumulado = ahorroInicial;
  for (let mes = 1; mes <= horizonte; mes += 1) {
    acumulado = Math.min(acumulado + ahorroMensual, meta);
    puntos.push({
      mes,
      etiqueta: `Mes ${mes}`,
      acumulado,
      meta,
    });
    if (acumulado >= meta) break;
  }

  return puntos;
}

function calcularMesesConAporteMensual(
  form: FormularioSimulacion,
  ahorroMensual: number,
): number {
  const cuota = calcularCuotaInicial(form.valorInmueble, form.porcentajeCuotaInicial);
  const faltante = Math.max(0, cuota - form.ahorroInicial);
  return calcularMesesParaMeta(faltante, ahorroMensual);
}

function construirPlanes(form: FormularioSimulacion, mesesBase: number): PlanAlternativo[] {
  const ahorroMensualBase = aporteMensualEquivalente(
    form.aportePeriodico,
    form.frecuencia,
  );
  const planes: PlanAlternativo[] = [];

  const mesesAcelerado = calcularMesesConAporteMensual(
    form,
    ahorroMensualBase * FACTOR_PLAN_ACELERADO,
  );

  planes.push({
    id: "acelerado",
    nombre: "Plan Acelerado",
    descripcion: `Aumenta tu aporte un 20% (${form.frecuencia.toLowerCase()}) para acortar la espera.`,
    meses: mesesAcelerado,
    aporteMensualEquivalente: ahorroMensualBase * FACTOR_PLAN_ACELERADO,
    destacado: mesesBase > UMBRAL_MESES_PLAN_ACELERADO,
  });

  const mesesCuota20 = calcularMesesParaMeta(
    Math.max(
      0,
      calcularCuotaInicial(form.valorInmueble, 20) - form.ahorroInicial,
    ),
    ahorroMensualBase,
  );

  planes.push({
    id: "cuota-20",
    nombre: "Cuota inicial 20%",
    descripcion: "Reduce la meta de enganche al 20% si el proyecto lo permite.",
    meses: mesesCuota20,
    aporteMensualEquivalente: ahorroMensualBase,
    destacado: false,
  });

  if (form.frecuencia === "Mensual") {
    const mesesQuincenal = calcularMesesConAporteMensual(form, form.aportePeriodico * 2);
    planes.push({
      id: "quincenal",
      nombre: "Aporte quincenal",
      descripcion: "Conserva el mismo monto, pero aporte cada 15 días (doble mensual).",
      meses: mesesQuincenal,
      aporteMensualEquivalente: form.aportePeriodico * 2,
      destacado: false,
    });
  } else {
    const mesesMasIngreso = calcularMesesConAporteMensual(form, ahorroMensualBase * 1.3);
    planes.push({
      id: "plus-30",
      nombre: "Plan +30%",
      descripcion: "Destina un 30% extra de tu aporte actual para llegar antes.",
      meses: mesesMasIngreso,
      aporteMensualEquivalente: ahorroMensualBase * 1.3,
      destacado: false,
    });
  }

  if (mesesBase > UMBRAL_MESES_PLAN_ACELERADO) {
    const acelerado = planes.find((plan) => plan.id === "acelerado");
    if (acelerado) {
      return [acelerado, ...planes.filter((plan) => plan.id !== "acelerado")];
    }
  }

  return planes;
}

export function calcularSimulacion(
  form: FormularioSimulacion,
  escenarioId = generarIdEscenario(),
): ResultadoSimulacion {
  const cuotaInicial = calcularCuotaInicial(
    form.valorInmueble,
    form.porcentajeCuotaInicial,
  );
  const faltante = Math.max(0, cuotaInicial - form.ahorroInicial);
  const ahorroMensual = aporteMensualEquivalente(
    form.aportePeriodico,
    form.frecuencia,
  );
  const mesesRaw = calcularMesesParaMeta(faltante, ahorroMensual);
  const meses = Number.isFinite(mesesRaw) ? mesesRaw : MAX_MESES_PROYECCION;
  const anios = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  return {
    escenarioId,
    cuotaInicial,
    faltante,
    aporteMensualEquivalente: ahorroMensual,
    meses,
    anios,
    mesesRestantes,
    yaAlcanzado: faltante <= 0,
    superaUmbralCincoAnios: meses > UMBRAL_MESES_PLAN_ACELERADO,
    proyeccion: construirProyeccion(
      form.ahorroInicial,
      ahorroMensual,
      cuotaInicial,
      meses,
    ),
    planes: construirPlanes(form, meses),
    ciudad: form.ciudad,
  };
}
