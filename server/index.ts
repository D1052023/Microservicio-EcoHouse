import path from "node:path";
import { crearApp } from "./app.ts";
import { crearRepositorioArchivo } from "./repositorio.ts";

const puerto = Number(process.env.PORT ?? 3001);
const archivo = path.join(process.cwd(), "data", "escenarios.json");
const app = crearApp(crearRepositorioArchivo(archivo));

app.listen(puerto, () => {
  console.log(`API EcoHouse escuchando en http://localhost:${puerto}`);
});
