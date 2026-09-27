import { calcularSimulacion } from "../lib/simulacion";
import { VALORES_DEFAULT, type ResultadoSimulacion } from "../types/simulacion";

export function resultadoEjemplo(): ResultadoSimulacion {
  return calcularSimulacion({ ...VALORES_DEFAULT, ciudad: "Barranquilla" }, "11111111-1111-4111-8111-111111111111");
}
