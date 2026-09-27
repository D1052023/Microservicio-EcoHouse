import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { AlertaValidacion } from "../types/simulacion";

interface PanelAlertasProps {
  alertas: AlertaValidacion[];
}

const estilos = {
  error: "border-red-300 bg-red-50 text-red-900",
  advertencia: "border-amber-300 bg-amber-50 text-amber-950",
  exito: "border-eco-300 bg-eco-50 text-eco-900",
};

export default function PanelAlertas({ alertas }: PanelAlertasProps) {
  if (alertas.length === 0) return null;

  return (
    <div className="flex flex-col gap-2" role="region" aria-label="Alertas de simulación">
      {alertas.map((alerta) => (
        <div
          key={alerta.id}
          role={alerta.tipo === "error" ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${estilos[alerta.tipo]}`}
        >
          {alerta.tipo === "error" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : alerta.tipo === "exito" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <p>{alerta.mensaje}</p>
        </div>
      ))}
    </div>
  );
}
