import { Gauge, Sparkles, Timer } from "lucide-react";
import type { PlanAlternativo } from "../types/simulacion";
import { formatearCOP, formatearMesesAnios } from "../lib/formato";

interface TarjetasResumenProps {
  planes: PlanAlternativo[];
  forzarAcelerado: boolean;
  exigirRevision?: boolean;
  planSeleccionadoId?: string;
  onSeleccionarPlan?: (plan: PlanAlternativo) => void;
}

export default function TarjetasResumen({
  planes,
  forzarAcelerado,
  exigirRevision = false,
  planSeleccionadoId,
  onSeleccionarPlan,
}: TarjetasResumenProps) {
  return (
    <section aria-labelledby="planes-titulo" className="flex flex-col gap-3">
      <h2 id="planes-titulo" className="text-lg font-semibold text-slate-900">
        Planes alternativos
      </h2>
      {exigirRevision ? (
        <p className="text-sm text-red-800">
          Selecciona un plan alternativo para poder guardar este escenario.
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {planes.map((plan) => {
          const seleccionado = planSeleccionadoId === plan.id;
          return (
            <article
              key={plan.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                seleccionado
                  ? "border-eco-600 ring-2 ring-eco-200 bg-eco-50"
                  : plan.destacado
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
              <p className="mb-3 text-sm text-slate-600">
                Aporte mensual equiv.: {formatearCOP(plan.aporteMensualEquivalente)}
              </p>
              {onSeleccionarPlan ? (
                <button
                  type="button"
                  aria-pressed={seleccionado}
                  onClick={() => onSeleccionarPlan(plan)}
                  className="w-full rounded-xl border border-eco-700 bg-white px-3 py-2 text-sm font-semibold text-eco-800 hover:bg-eco-50"
                >
                  {seleccionado ? "Plan revisado" : "Revisar este plan"}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
