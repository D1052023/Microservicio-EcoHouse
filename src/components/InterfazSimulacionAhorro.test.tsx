import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InterfazSimulacionAhorro from "../components/InterfazSimulacionAhorro";

describe("InterfazSimulacionAhorro", () => {
  it("deshabilita el cálculo y muestra el error del 5%", () => {
    render(<InterfazSimulacionAhorro />);

    fireEvent.change(screen.getByLabelText(/ingreso mensual/i), {
      target: { value: "3000000" },
    });
    fireEvent.change(screen.getByLabelText(/aporte periódico/i), {
      target: { value: "50000" },
    });

    expect(
      screen.getAllByText(
        "El aporte periódico debe ser de al menos el 5% de tus ingresos ($150.000 COP)",
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /calcular simulación/i })).toBeDisabled();
  });

  it("calcula el escenario válido de aceptación", () => {
    render(<InterfazSimulacionAhorro />);

    fireEvent.click(screen.getByRole("button", { name: /calcular simulación/i }));

    expect(screen.getByText("220 meses")).toBeInTheDocument();
    expect(screen.getByText("Plan Acelerado")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/gráfico de proyección del ahorro acumulado/i),
    ).toBeInTheDocument();
  });
});
