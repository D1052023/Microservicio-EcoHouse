import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TarjetasResumen from "./TarjetasResumen";
import { resultadoEjemplo } from "../test/fixtures";

describe("TarjetasResumen", () => {
  it("lista planes y permite revisar uno", () => {
    const onSeleccionarPlan = vi.fn();
    const resultado = resultadoEjemplo();

    render(
      <TarjetasResumen
        planes={resultado.planes}
        forzarAcelerado
        exigirRevision
        onSeleccionarPlan={onSeleccionarPlan}
      />,
    );

    expect(screen.getByText("Plan Acelerado")).toBeInTheDocument();
    expect(screen.getByText("Cuota inicial 20%")).toBeInTheDocument();
    expect(
      screen.getByText("Selecciona un plan alternativo para poder guardar este escenario."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /revisar este plan/i })[0]);
    expect(onSeleccionarPlan).toHaveBeenCalledTimes(1);
  });
});
