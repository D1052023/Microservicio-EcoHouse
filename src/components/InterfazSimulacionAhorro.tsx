import { useMemo, useState } from "react";
import { BookmarkPlus, Leaf, RotateCcw } from "lucide-react";
import FormularioSimulacion from "./FormularioSimulacion";
import GraficoProyeccion from "./GraficoProyeccion";
import MetricasPrincipales from "./MetricasPrincipales";
import PanelAlertas from "./PanelAlertas";
import TarjetasResumen from "./TarjetasResumen";
import { calcularSimulacion } from "../lib/simulacion";
import { formularioEsValido, validarFormulario } from "../lib/validacion";
import { formatearMesesAnios } from "../lib/formato";
import {
  UMBRAL_MESES_PLAN_ACELERADO,
  VALORES_DEFAULT,
  type AlertaValidacion,
  type EscenarioGuardado,
  type FormularioSimulacion as Formulario,
  type ResultadoSimulacion,
} from "../types/simulacion";

const STORAGE_KEY = "ecohouse.escenarios";

function leerEscenarios(): EscenarioGuardado[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EscenarioGuardado[]) : [];
  } catch {
    return [];
  }
}

export default function InterfazSimulacionAhorro() {
  const [formulario, setFormulario] = useState<Formulario>(VALORES_DEFAULT);
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [escenarios, setEscenarios] = useState<EscenarioGuardado[]>(() =>
    typeof window === "undefined" ? [] : leerEscenarios(),
  );

  const errores = useMemo(() => validarFormulario(formulario), [formulario]);
  const puedeCalcular = formularioEsValido(formulario);

  const alertas: AlertaValidacion[] = useMemo(() => {
    const lista = [...errores];
    if (resultado?.superaUmbralCincoAnios) {
      lista.push({
        id: "horizonte-largo",
        tipo: "advertencia",
        mensaje: `El ahorro estimado supera ${UMBRAL_MESES_PLAN_ACELERADO} meses (${formatearMesesAnios(resultado.meses)}). Revisa el Plan Acelerado.`,
      });
    }
    if (resultado && !resultado.yaAlcanzado && errores.length === 0) {
      lista.push({
        id: "listo",
        tipo: "exito",
        mensaje: `Escenario ${resultado.escenarioId} listo para ${resultado.ciudad}.`,
      });
    }
    return lista;
  }, [errores, resultado]);

  const calcular = () => {
    if (!puedeCalcular) return;
    const inicio = performance.now();
    setCalculando(true);
    setGuardado(false);

    const siguiente = calcularSimulacion(formulario);
    setResultado(siguiente);

    const restante = Math.max(0, 16 - (performance.now() - inicio));
    window.setTimeout(() => setCalculando(false), restante);
  };

  const guardar = () => {
    if (!resultado || !puedeCalcular) return;
    const registro: EscenarioGuardado = {
      id: resultado.escenarioId,
      fechaIso: new Date().toISOString(),
      formulario,
      meses: resultado.meses,
    };
    const siguiente = [registro, ...escenarios].slice(0, 8);
    setEscenarios(siguiente);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente));
    setGuardado(true);
  };

  const reiniciar = () => {
    setFormulario(VALORES_DEFAULT);
    setResultado(null);
    setGuardado(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-slate-50 to-eco-50">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-700 text-white">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-eco-700">EcoHouse</p>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Simulación de Ahorro / Financiación
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={reiniciar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reiniciar
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Configura tu escenario</h2>
          <p className="mb-5 text-sm text-slate-600">
            Estima cuánto tardarás en completar la cuota inicial de tu primera vivienda en el Caribe
            colombiano.
          </p>
          <FormularioSimulacion
            valores={formulario}
            onChange={(valores) => {
              setFormulario(valores);
              setGuardado(false);
            }}
            onCalcular={calcular}
            puedeCalcular={puedeCalcular}
            calculando={calculando}
          />
        </section>

        <section className="flex flex-col gap-4 lg:col-span-7">
          <PanelAlertas alertas={alertas} />

          {resultado ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-600">
                  ID de escenario:{" "}
                  <span className="font-mono text-xs font-semibold text-slate-900 sm:text-sm">
                    {resultado.escenarioId}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={guardar}
                  disabled={!puedeCalcular}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-700 px-3 py-2 text-sm font-semibold text-white hover:bg-ocean-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                  {guardado ? "Escenario guardado" : "Guardar Escenario"}
                </button>
              </div>

              <MetricasPrincipales resultado={resultado} />

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Proyección de ahorro vs meta
                </h2>
                <GraficoProyeccion datos={resultado.proyeccion} />
              </div>

              <TarjetasResumen
                planes={resultado.planes}
                forzarAcelerado={resultado.superaUmbralCincoAnios}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
              Completa el formulario y pulsa <strong>Calcular Simulación</strong> para ver el tiempo
              estimado, el gráfico y los planes alternativos.
            </div>
          )}

          {escenarios.length > 0 ? (
            <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <h2 className="mb-2 font-semibold text-slate-900">Escenarios guardados</h2>
              <ul className="flex flex-col gap-1.5">
                {escenarios.map((item) => (
                  <li key={item.id} className="flex flex-wrap justify-between gap-2 text-slate-600">
                    <span className="font-mono text-xs">{item.id.slice(0, 8)}…</span>
                    <span>
                      {item.formulario.ciudad} · {item.meses} meses
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </section>
      </main>
    </div>
  );
}
