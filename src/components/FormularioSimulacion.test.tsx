import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormularioSimulacion from "./FormularioSimulacion";
import { VALORES_DEFAULT } from "../types/simulacion";

describe("FormularioSimulacion", () => {
  it("impide montos negativos en tiempo real", () => {
    const valores = { ...VALORES_DEFAULT };
    const onChange = (siguiente: typeof valores) => {
      Object.assign(valores, siguiente);
      rerender(
        <FormularioSimulacion
          valores={valores}
          onChange={onChange}
          onCalcular={() => undefined}
          puedeCalcular
          calculando={false}
        />,
      );
    };

    const { rerender } = render(
      <FormularioSimulacion
        valores={valores}
        onChange={onChange}
        onCalcular={() => undefined}
        puedeCalcular
        calculando={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/ingreso mensual/i), { target: { value: "-1500000" } });
    fireEvent.change(screen.getByLabelText(/ahorro inicial/i), { target: { value: "-10" } });
    fireEvent.change(screen.getByLabelText(/valor del inmueble/i), { target: { value: "abc" } });

    expect(screen.getByLabelText(/ingreso mensual/i)).toHaveValue(0);
    expect(screen.getByLabelText(/ahorro inicial/i)).toHaveValue(0);
    expect(screen.getByLabelText(/valor del inmueble/i)).toHaveValue(0);
  });
});
