import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

Object.defineProperty(HTMLElement.prototype, "clientWidth", {
  configurable: true,
  value: 800,
});
Object.defineProperty(HTMLElement.prototype, "clientHeight", {
  configurable: true,
  value: 320,
});

vi.stubGlobal(
  "fetch",
  vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();
    const headers = { "Content-Type": "application/json" };

    if (url.endsWith("/api/escenarios") && method === "GET") {
      return new Response(JSON.stringify([]), { status: 200, headers });
    }

    if (url.endsWith("/api/escenarios") && method === "POST") {
      const body = JSON.parse(String(init?.body ?? "{}")) as {
        escenarioId?: string;
        formulario?: unknown;
        planAlternativoId?: string;
      };
      return new Response(
        JSON.stringify({
          id: body.escenarioId ?? "11111111-1111-4111-8111-111111111111",
          fechaIso: new Date().toISOString(),
          formulario: body.formulario,
          meses: 220,
          planAlternativoId: body.planAlternativoId,
        }),
        { status: 201, headers },
      );
    }

    return new Response(JSON.stringify({ mensaje: "Ruta no encontrada" }), { status: 404, headers });
  }),
);
