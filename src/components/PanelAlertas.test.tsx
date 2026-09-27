import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PanelAlertas from "./PanelAlertas";

describe("PanelAlertas", () => {
  it("no renderiza nada sin alertas", () => {
    const { container } = render(<PanelAlertas alertas={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("usa role=alert para errores y status para el resto", () => {
    render(
      <PanelAlertas
        alertas={[
          { id: "e1", tipo: "error", mensaje: "El tiempo estimado supera 15 años (180 meses)." },
          { id: "a1", tipo: "advertencia", mensaje: "Revisa el Plan Acelerado." },
          { id: "ok", tipo: "exito", mensaje: "Escenario listo." },
        ]}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("15 años");
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getByLabelText("Alertas de simulación")).toBeInTheDocument();
  });
});
