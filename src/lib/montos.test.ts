import { describe, expect, it } from "vitest";
import { parsearMontoNoNegativo } from "./montos";

describe("parsearMontoNoNegativo", () => {
  it("convierte negativos a 0", () => {
    expect(parsearMontoNoNegativo("-100")).toBe(0);
    expect(parsearMontoNoNegativo("-2500000")).toBe(0);
  });

  it("convierte texto no numérico a 0", () => {
    expect(parsearMontoNoNegativo("abc")).toBe(0);
    expect(parsearMontoNoNegativo("")).toBe(0);
  });

  it("conserva montos enteros válidos en COP", () => {
    expect(parsearMontoNoNegativo("2500000")).toBe(2_500_000);
  });
});
