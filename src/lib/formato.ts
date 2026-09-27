export function formatearCOP(valor: number): string {
  const entero = Math.round(valor);
  return `$${entero.toLocaleString("es-CO")} COP`;
}

export function formatearMesesAnios(meses: number): string {
  if (meses <= 0) return "0 meses";
  const anios = Math.floor(meses / 12);
  const resto = meses % 12;
  if (anios === 0) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  if (resto === 0) return `${anios} ${anios === 1 ? "año" : "años"}`;
  return `${anios} ${anios === 1 ? "año" : "años"} y ${resto} ${resto === 1 ? "mes" : "meses"}`;
}

export function generarIdEscenario(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
