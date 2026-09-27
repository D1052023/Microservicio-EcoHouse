import { describe, expect, it } from "vitest";
import {
  aporteMensualEquivalente,
  calcularCuotaInicial,
  calcularMesesParaMeta,
  calcularSimulacion,
} from "../lib/simulacion";
import { UMBRAL_MESES_PLAN_ACELERADO, VALORES_DEFAULT } from "../types/simulacion";

describe("calcularSimulacion", () => {
  it("caso válido: Barranquilla con valores de aceptación", () => {
    const inicio = performance.now();
    const resultado = calcularSimulacion({
      ...VALORES_DEFAULT,
      ingresoMensual: 2_500_000,
      aportePeriodico: 200_000,
      valorInmueble: 150_000_000,
      ciudad: "Barranquilla",
    });
    const duracion = performance.now() - inicio;

    expect(duracion).toBeLessThan(800);
    expect(resultado.cuotaInicial).toBe(45_000_000);
    expect(resultado.faltante).toBe(44_000_000);
    expect(resultado.aporteMensualEquivalente).toBe(200_000);
    expect(resultado.meses).toBe(220);
    expect(resultado.ciudad).toBe("Barranquilla");
    expect(resultado.proyeccion.length).toBeGreaterThan(1);
    expect(resultado.proyeccion.at(-1)?.acumulado).toBe(resultado.cuotaInicial);
    expect(resultado.superaUmbralCincoAnios).toBe(true);
    expect(resultado.planes.some((plan) => plan.id === "acelerado" && plan.destacado)).toBe(
      true,
    );
    expect(resultado.escenarioId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("duplica el aporte mensual cuando la frecuencia es quincenal", () => {
    expect(aporteMensualEquivalente(200_000, "Quincenal")).toBe(400_000);
    const mensual = calcularSimulacion({
      ...VALORES_DEFAULT,
      frecuencia: "Mensual",
    });
    const quincenal = calcularSimulacion({
      ...VALORES_DEFAULT,
      frecuencia: "Quincenal",
    });
    expect(quincenal.meses).toBeLessThan(mensual.meses);
  });

  it("devuelve 0 meses si el ahorro inicial cubre la cuota", () => {
    const resultado = calcularSimulacion({
      ...VALORES_DEFAULT,
      ahorroInicial: 50_000_000,
      valorInmueble: 100_000_000,
      porcentajeCuotaInicial: 30,
    });
    expect(resultado.meses).toBe(0);
    expect(resultado.yaAlcanzado).toBe(true);
  });
});

describe("reglas de cálculo auxiliares", () => {
  it("la cuota inicial es el porcentaje del inmueble", () => {
    expect(calcularCuotaInicial(150_000_000, 30)).toBe(45_000_000);
    expect(calcularCuotaInicial(150_000_000, 10)).toBe(15_000_000);
  });

  it("redondea hacia arriba los meses incompletos", () => {
    expect(calcularMesesParaMeta(100, 40)).toBe(3);
    expect(calcularMesesParaMeta(0, 40)).toBe(0);
  });

  it("marca Plan Acelerado cuando supera 60 meses", () => {
    const resultado = calcularSimulacion(VALORES_DEFAULT);
    expect(resultado.meses).toBeGreaterThan(UMBRAL_MESES_PLAN_ACELERADO);
    const acelerado = resultado.planes.find((plan) => plan.id === "acelerado");
    expect(acelerado?.destacado).toBe(true);
  });
});
