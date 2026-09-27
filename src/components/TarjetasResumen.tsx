import { Gauge, Sparkles, Timer } from "lucide-react";
import type { PlanAlternativo } from "../types/simulacion";
import { formatearCOP, formatearMesesAnios } from "../lib/formato";

interface TarjetasResumenProps {
  planes: PlanAlternativo[];
  forzarAcelerado: boolean;
}

export default function TarjetasResumen({ planes, forzarAcelerado }: TarjetasResumenProps) {
  return (
    <section aria-labelledby="planes-titulo" className="flex flex-col gap-3">
      <h2 id="planes-titulo" className="text-lg font-semibold text-slate-900">
        Planes alternativos
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {planes.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-2xl border p-4 shadow-sm ${
              plan.destacado
                ? "border-amber-300 bg-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-2 flex items-center gap-2 text-eco-800">
              {plan.id === "acelerado" ? (
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              ) : plan.id === "cuota-20" ? (
                <Gauge className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Timer className="h-5 w-5" aria-hidden="true" />
              )}
              <h3 className="font-semibold text-slate-900">{plan.nombre}</h3>
            </div>
            {plan.destacado || (forzarAcelerado && plan.id === "acelerado") ? (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Sugerido: tu plan actual supera 5 años
              </p>
            ) : null}
            <p className="mb-3 text-sm text-slate-600">{plan.descripcion}</p>
            <p className="text-sm font-medium text-slate-800">
              Tiempo: {formatearMesesAnios(plan.meses)}
            </p>
            <p className="text-sm text-slate-600">
              Aporte mensual equiv.: {formatearCOP(plan.aporteMensualEquivalente)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
