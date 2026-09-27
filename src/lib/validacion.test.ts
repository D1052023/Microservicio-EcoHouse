import { describe, expect, it } from "vitest";
import {
  aporteMinimoRequerido,
  cumpleReglaAporteMinimo,
  mensajeReglaAporteMinimo,
  puedeGuardarEscenario,
  validarFormulario,
  validarGuardadoEscenario,
} from "./validacion";
import { VALORES_DEFAULT } from "../types/simulacion";

describe("regla del 5% de aporte mínimo", () => {
  it("exige $150.000 COP cuando el ingreso es $3.000.000", () => {
    const ingreso = 3_000_000;
    const aporteInvalido = 50_000;

    expect(aporteMinimoRequerido(ingreso)).toBe(150_000);
    expect(cumpleReglaAporteMinimo(ingreso, aporteInvalido)).toBe(false);
    expect(mensajeReglaAporteMinimo(ingreso)).toBe(
      "El aporte periódico debe ser de al menos el 5% de tus ingresos ($150.000 COP)",
    );
  });

  it("bloquea el formulario cuando se viola la regla del 5%", () => {
    const alertas = validarFormulario({
      ...VALORES_DEFAULT,
      ingresoMensual: 3_000_000,
      aportePeriodico: 50_000,
    });
    const errorAporte = alertas.find((alerta) => alerta.id === "aporte-minimo");

    expect(errorAporte?.tipo).toBe("error");
    expect(errorAporte?.mensaje).toBe(
      "El aporte periódico debe ser de al menos el 5% de tus ingresos ($150.000 COP)",
    );
  });

  it("acepta un aporte igual o superior al 5%", () => {
    expect(cumpleReglaAporteMinimo(2_500_000, 125_000)).toBe(true);
    expect(cumpleReglaAporteMinimo(2_500_000, 200_000)).toBe(true);
  });

  it("rechaza cuota inicial inferior al 10%", () => {
    const alertas = validarFormulario({
      ...VALORES_DEFAULT,
      porcentajeCuotaInicial: 9,
    });
    expect(alertas.some((alerta) => alerta.id === "cuota")).toBe(true);
  });

  it("marca error si el horizonte supera 15 años y no hay plan revisado", () => {
    const alertas = validarGuardadoEscenario(VALORES_DEFAULT);
    const horizonte = alertas.find((alerta) => alerta.id === "horizonte-maximo");
    expect(horizonte?.tipo).toBe("error");
    expect(horizonte?.mensaje).toContain("15 años");
    expect(puedeGuardarEscenario(VALORES_DEFAULT)).toBe(false);
    expect(puedeGuardarEscenario(VALORES_DEFAULT, "cuota-20")).toBe(true);
  });
});
