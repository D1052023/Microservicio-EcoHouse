import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MetricasPrincipales from "./MetricasPrincipales";
import { resultadoEjemplo } from "../test/fixtures";

describe("MetricasPrincipales", () => {
  it("muestra tiempo, cuota y ciudad del resultado", () => {
    render(<MetricasPrincipales resultado={resultadoEjemplo()} />);

    expect(screen.getByText("220 meses")).toBeInTheDocument();
    expect(screen.getByText("Barranquilla")).toBeInTheDocument();
    expect(screen.getByText(/cuota inicial/i)).toBeInTheDocument();
    expect(screen.getByText("$45.000.000 COP")).toBeInTheDocument();
  });
});
