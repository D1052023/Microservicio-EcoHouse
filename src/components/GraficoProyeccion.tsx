import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import type { PuntoProyeccion } from "../types/simulacion";
import { formatearCOP } from "../lib/formato";

interface GraficoProyeccionProps {
  datos: PuntoProyeccion[];
}

export default function GraficoProyeccion({ datos }: GraficoProyeccionProps) {
  const muestra =
    datos.length > 72
      ? datos.filter((punto, index) => index === 0 || punto.mes % 3 === 0 || index === datos.length - 1)
      : datos;

  return (
    <div
      className="h-72 w-full sm:h-80"
      role="img"
      aria-label="Gráfico de proyección del ahorro acumulado mes a mes frente a la meta de cuota inicial"
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <ComposedChart data={muestra} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: "#475569" }} interval="preserveStartEnd" />
          <YAxis
            tick={{ fontSize: 11, fill: "#475569" }}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `${Math.round(v / 1_000_000)}M` : `${Math.round(v / 1000)}k`
            }
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatearCOP(value),
              name === "acumulado" ? "Ahorro acumulado" : "Meta cuota inicial",
            ]}
            labelClassName="text-slate-700 font-medium"
          />
          <Legend
            formatter={(value) => (value === "acumulado" ? "Ahorro acumulado" : "Meta")}
          />
          <Bar dataKey="acumulado" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Line type="monotone" dataKey="meta" stroke="#1d4ed8" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
