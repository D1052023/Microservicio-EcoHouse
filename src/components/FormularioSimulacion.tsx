import {
  CIUDADES,
  FRECUENCIAS,
  PORCENTAJE_CUOTA_MINIMO,
  type FormularioSimulacion,
} from "../types/simulacion";
import { formatearCOP } from "../lib/formato";
import { parsearMontoNoNegativo } from "../lib/montos";
import { aporteMinimoRequerido, cumpleReglaAporteMinimo } from "../lib/validacion";

interface FormularioSimulacionProps {
  valores: FormularioSimulacion;
  onChange: (valores: FormularioSimulacion) => void;
  onCalcular: () => void;
  puedeCalcular: boolean;
  calculando: boolean;
}

function CampoMoneda({
  id,
  etiqueta,
  valor,
  onValor,
  descripcion,
  error,
  min = 0,
}: {
  id: string;
  etiqueta: string;
  valor: number;
  onValor: (n: number) => void;
  descripcion?: string;
  error?: string;
  min?: number;
}) {
  const describedBy = [
    descripcion ? `${id}-ayuda` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type="number"
        inputMode="numeric"
        min={min}
        step={50000}
        value={Number.isFinite(valor) ? valor : 0}
        onChange={(e) => onValor(parsearMontoNoNegativo(e.target.value))}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-600 focus:ring-red-200"
            : "border-slate-200 focus:border-eco-600 focus:ring-eco-100"
        }`}
      />
      {descripcion ? (
        <p id={`${id}-ayuda`} className="text-xs text-slate-500">
          {descripcion}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function FormularioSimulacion({
  valores,
  onChange,
  onCalcular,
  puedeCalcular,
  calculando,
}: FormularioSimulacionProps) {
  const aporteInvalido = !cumpleReglaAporteMinimo(
    valores.ingresoMensual,
    valores.aportePeriodico,
  );
  const minimoAporte = aporteMinimoRequerido(valores.ingresoMensual);

  const actualizar = <K extends keyof FormularioSimulacion>(
    campo: K,
    valor: FormularioSimulacion[K],
  ) => {
    onChange({ ...valores, [campo]: valor });
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (puedeCalcular) onCalcular();
      }}
      noValidate
    >
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="sr-only">Datos de ingreso y ahorro</legend>
        <CampoMoneda
          id="ingresoMensual"
          etiqueta="Ingreso mensual"
          valor={valores.ingresoMensual}
          onValor={(n) => actualizar("ingresoMensual", n)}
          descripcion="Ingresos netos aproximados en pesos colombianos."
        />
        <CampoMoneda
          id="ahorroInicial"
          etiqueta="Ahorro inicial"
          valor={valores.ahorroInicial}
          onValor={(n) => actualizar("ahorroInicial", n)}
          descripcion="Lo que ya tienes destinado a la cuota inicial."
        />
        <CampoMoneda
          id="aportePeriodico"
          etiqueta="Aporte periódico"
          valor={valores.aportePeriodico}
          onValor={(n) => actualizar("aportePeriodico", n)}
          error={
            aporteInvalido
              ? `El aporte periódico debe ser de al menos el 5% de tus ingresos (${formatearCOP(minimoAporte)})`
              : undefined
          }
          descripcion={`Mínimo sugerido: ${formatearCOP(minimoAporte)} (5% del ingreso).`}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="frecuencia" className="text-sm font-semibold text-slate-800">
            Frecuencia
          </label>
          <select
            id="frecuencia"
            name="frecuencia"
            value={valores.frecuencia}
            onChange={(e) =>
              actualizar("frecuencia", e.target.value as FormularioSimulacion["frecuencia"])
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-eco-600 focus:ring-2 focus:ring-eco-100"
          >
            {FRECUENCIAS.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="sr-only">Datos del inmueble</legend>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ciudad" className="text-sm font-semibold text-slate-800">
            Ciudad
          </label>
          <select
            id="ciudad"
            name="ciudad"
            value={valores.ciudad}
            onChange={(e) =>
              actualizar("ciudad", e.target.value as FormularioSimulacion["ciudad"])
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-eco-600 focus:ring-2 focus:ring-eco-100"
          >
            {CIUDADES.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
        <CampoMoneda
          id="valorInmueble"
          etiqueta="Valor del inmueble"
          valor={valores.valorInmueble}
          onValor={(n) => actualizar("valorInmueble", n)}
          min={1}
        />
        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="porcentajeCuotaInicial" className="text-sm font-semibold text-slate-800">
              Porcentaje de cuota inicial
            </label>
            <span className="rounded-full bg-eco-100 px-2.5 py-0.5 text-sm font-semibold text-eco-800">
              {valores.porcentajeCuotaInicial}%
            </span>
          </div>
          <input
            id="porcentajeCuotaInicial"
            name="porcentajeCuotaInicial"
            type="range"
            min={PORCENTAJE_CUOTA_MINIMO}
            max={60}
            step={1}
            value={valores.porcentajeCuotaInicial}
            onChange={(e) => actualizar("porcentajeCuotaInicial", Number(e.target.value))}
            aria-valuemin={PORCENTAJE_CUOTA_MINIMO}
            aria-valuemax={60}
            aria-valuenow={valores.porcentajeCuotaInicial}
            aria-valuetext={`${valores.porcentajeCuotaInicial} por ciento`}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-eco-600"
          />
          <p id="porcentajeCuotaInicial-ayuda" className="text-xs text-slate-500">
            Mínimo legal de simulación: {PORCENTAJE_CUOTA_MINIMO}%. Valor por defecto: 30%.
          </p>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!puedeCalcular || calculando}
        aria-disabled={!puedeCalcular || calculando}
        className="inline-flex items-center justify-center rounded-xl bg-eco-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {calculando ? "Calculando…" : "Calcular Simulación"}
      </button>
    </form>
  );
}
