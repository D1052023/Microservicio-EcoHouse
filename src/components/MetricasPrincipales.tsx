import { CalendarClock, Home, MapPin } from "lucide-react";
import type { ResultadoSimulacion } from "../types/simulacion";
import { formatearCOP, formatearMesesAnios } from "../lib/formato";

interface MetricasPrincipalesProps {
  resultado: ResultadoSimulacion;
}

export default function MetricasPrincipales({ resultado }: MetricasPrincipalesProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-eco-700">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Tiempo estimado</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{resultado.meses} meses</p>
        <p className="text-sm text-slate-600">{formatearMesesAnios(resultado.meses)}</p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-ocean-700">
          <Home className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Cuota inicial</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{formatearCOP(resultado.cuotaInicial)}</p>
        <p className="text-sm text-slate-600">Faltante: {formatearCOP(resultado.faltante)}</p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-eco-700">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Ciudad</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{resultado.ciudad}</p>
        <p className="text-sm text-slate-600">
          Aporte mensual equiv.: {formatearCOP(resultado.aporteMensualEquivalente)}
        </p>
      </article>
    </div>
  );
}
