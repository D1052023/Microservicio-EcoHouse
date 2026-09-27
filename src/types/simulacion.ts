export const CIUDADES = ["Cartagena", "Barranquilla", "Santa Marta"] as const;
export const FRECUENCIAS = ["Mensual", "Quincenal"] as const;

export type Ciudad = (typeof CIUDADES)[number];
export type Frecuencia = (typeof FRECUENCIAS)[number];

export const PORCENTAJE_CUOTA_MINIMO = 10;
export const PORCENTAJE_CUOTA_DEFAULT = 30;
export const RATIO_APORTE_MINIMO = 0.05;
export const UMBRAL_MESES_PLAN_ACELERADO = 60;
export const FACTOR_PLAN_ACELERADO = 1.2;
export const MAX_MESES_PROYECCION = 240;

export interface FormularioSimulacion {
  ingresoMensual: number;
  ahorroInicial: number;
  aportePeriodico: number;
  frecuencia: Frecuencia;
  ciudad: Ciudad;
  valorInmueble: number;
  porcentajeCuotaInicial: number;
}

export const VALORES_DEFAULT: FormularioSimulacion = {
  ingresoMensual: 2_500_000,
  ahorroInicial: 1_000_000,
  aportePeriodico: 200_000,
  frecuencia: "Mensual",
  ciudad: "Barranquilla",
  valorInmueble: 150_000_000,
  porcentajeCuotaInicial: PORCENTAJE_CUOTA_DEFAULT,
};

export interface PuntoProyeccion {
  mes: number;
  etiqueta: string;
  acumulado: number;
  meta: number;
}

export interface PlanAlternativo {
  id: string;
  nombre: string;
  descripcion: string;
  meses: number;
  aporteMensualEquivalente: number;
  destacado: boolean;
}

export interface ResultadoSimulacion {
  escenarioId: string;
  cuotaInicial: number;
  faltante: number;
  aporteMensualEquivalente: number;
  meses: number;
  anios: number;
  mesesRestantes: number;
  yaAlcanzado: boolean;
  superaUmbralCincoAnios: boolean;
  proyeccion: PuntoProyeccion[];
  planes: PlanAlternativo[];
  ciudad: Ciudad;
}

export interface AlertaValidacion {
  id: string;
  tipo: "error" | "advertencia" | "exito";
  mensaje: string;
}

export interface EscenarioGuardado {
  id: string;
  fechaIso: string;
  formulario: FormularioSimulacion;
  meses: number;
}
