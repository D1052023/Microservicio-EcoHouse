/**
 * Normaliza un valor de moneda pegado o escrito en un input.
 *
 * @param valorCrudo - Texto crudo del campo (`type="number"` o pegado).
 * @returns Monto entero ≥ 0 en COP. Valores negativos, `NaN` o no numéricos se convierten en 0.
 */
export function parsearMontoNoNegativo(valorCrudo: string): number {
  const recortado = valorCrudo.trim();
  if (recortado === "" || recortado === "-" || recortado === "." || recortado === "+") {
    return 0;
  }

  const directo = Number(recortado);
  if (Number.isFinite(directo)) {
    return directo < 0 ? 0 : Math.floor(directo);
  }

  const soloDigitos = recortado.replace(/[^\d]/g, "");
  if (!soloDigitos) return 0;
  return Number(soloDigitos);
}
