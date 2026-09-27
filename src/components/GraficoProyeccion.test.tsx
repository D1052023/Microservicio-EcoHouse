import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GraficoProyeccion from "./GraficoProyeccion";

describe("GraficoProyeccion", () => {
  it("expone un gráfico accesible con la proyección", () => {
    render(
      <GraficoProyeccion
        datos={[
          { mes: 0, etiqueta: "Inicio", acumulado: 1_000_000, meta: 45_000_000 },
          { mes: 1, etiqueta: "Mes 1", acumulado: 1_200_000, meta: 45_000_000 },
        ]}
      />,
    );

    expect(
      screen.getByLabelText(
        "Gráfico de proyección del ahorro acumulado mes a mes frente a la meta de cuota inicial",
      ),
    ).toBeInTheDocument();
  });
});
