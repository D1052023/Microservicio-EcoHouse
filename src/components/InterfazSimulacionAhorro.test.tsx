import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import InterfazSimulacionAhorro from "./InterfazSimulacionAhorro";
import FormularioSimulacion from "./FormularioSimulacion";
import PanelAlertas from "./PanelAlertas";
import MetricasPrincipales from "./MetricasPrincipales";
import { VALORES_DEFAULT } from "../types/simulacion";
import { resultadoEjemplo } from "../test/fixtures";

describe("accesibilidad", () => {
  it("el formulario no tiene violaciones WCAG serias", async () => {
    const { container } = render(
      <FormularioSimulacion
        valores={VALORES_DEFAULT}
        onChange={() => undefined}
        onCalcular={() => undefined}
        puedeCalcular
        calculando={false}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("el panel de resultados no tiene violaciones WCAG serias", async () => {
    const { container } = render(
      <div>
        <PanelAlertas
          alertas={[
            {
              id: "e",
              tipo: "error",
              mensaje: "Debes revisar un plan alternativo antes de guardar el escenario.",
            },
          ]}
        />
        <MetricasPrincipales resultado={resultadoEjemplo()} />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

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

  it("calcula el escenario y bloquea el guardado hasta revisar un plan", async () => {
    render(<InterfazSimulacionAhorro />);

    fireEvent.click(screen.getByRole("button", { name: /calcular simulación/i }));

    expect(await screen.findByText("220 meses")).toBeInTheDocument();
    expect(screen.getByText("Plan Acelerado")).toBeInTheDocument();
    expect(
      await screen.findByLabelText(/gráfico de proyección del ahorro acumulado/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /guardar escenario/i })).toBeDisabled();
    expect(screen.getByRole("alert").textContent).toMatch(/15 años/);

    const tarjeta = screen.getByText("Cuota inicial 20%").closest("article");
    expect(tarjeta).toBeTruthy();
    fireEvent.click(within(tarjeta as HTMLElement).getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /guardar escenario/i })).not.toBeDisabled();
    });
  });
});
