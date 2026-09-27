import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { EscenarioGuardado } from "../src/types/simulacion.ts";

export interface RepositorioEscenarios {
  listar(): Promise<EscenarioGuardado[]>;
  obtener(id: string): Promise<EscenarioGuardado | undefined>;
  guardar(escenario: EscenarioGuardado): Promise<EscenarioGuardado>;
}

export function crearRepositorioMemoria(
  inicial: EscenarioGuardado[] = [],
): RepositorioEscenarios {
  const datos = [...inicial];

  return {
    async listar() {
      return [...datos];
    },
    async obtener(id) {
      return datos.find((item) => item.id === id);
    },
    async guardar(escenario) {
      const indice = datos.findIndex((item) => item.id === escenario.id);
      if (indice >= 0) datos[indice] = escenario;
      else datos.unshift(escenario);
      return escenario;
    },
  };
}

export function crearRepositorioArchivo(archivo: string): RepositorioEscenarios {
  const memoria = crearRepositorioMemoria();
  let listo: Promise<void> | null = null;

  const cargar = async () => {
    try {
      const raw = await readFile(archivo, "utf8");
      const parsed = JSON.parse(raw) as EscenarioGuardado[];
      for (const item of parsed.reverse()) {
        await memoria.guardar(item);
      }
    } catch (err) {
      const codigo = (err as NodeJS.ErrnoException).code;
      if (codigo !== "ENOENT") throw err;
    }
  };

  const persistir = async () => {
    await mkdir(path.dirname(archivo), { recursive: true });
    const lista = await memoria.listar();
    await writeFile(archivo, JSON.stringify(lista, null, 2), "utf8");
  };

  const asegurar = () => {
    listo ??= cargar();
    return listo;
  };

  return {
    async listar() {
      await asegurar();
      return memoria.listar();
    },
    async obtener(id) {
      await asegurar();
      return memoria.obtener(id);
    },
    async guardar(escenario) {
      await asegurar();
      const guardado = await memoria.guardar(escenario);
      await persistir();
      return guardado;
    },
  };
}
