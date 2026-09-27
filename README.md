# EcoHouse — Simulación de Ahorro / Financiación

Aplicación para estimar cuánto tardará una persona joven del Caribe colombiano en completar la **cuota inicial** de su primera vivienda.

## Arquitectura

El repositorio se llama **Microservicio-EcoHouse** porque incluye dos capas:

1. **SPA React (frontend)** en `src/`: formulario, proyección (Recharts se carga con `React.lazy`) y validación inmediata.
2. **API REST (microservicio)** en `server/`: validación server-side, persistencia de escenarios y errores HTTP (`400`, `404`, `500`).

El cálculo interactivo corre en el navegador (< 800 ms). **Guardar** pasa por `POST /api/escenarios`; la API vuelve a validar la regla del 5% y el horizonte máximo de **15 años (180 meses)**. Los escenarios se persisten en `data/escenarios.json` (no en `localStorage`).

```
Navegador (Vite :5173)  --proxy /api-->  Express (:3001)  -->  data/escenarios.json
```

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Eso levanta la API y la interfaz. Abre `http://localhost:5173`.

| Comando | Descripción |
| --- | --- |
| `npm run dev` | API (`tsx`) + frontend (Vite) |
| `npm run dev:web` | Solo Vite |
| `npm run dev:api` | Solo API en `:3001` |
| `npm test` | Vitest + Testing Library + jest-axe |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build (la API debe estar en `:3001`) |

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/salud` | Health check |
| `POST` | `/api/simulaciones` | Calcula y valida el escenario |
| `GET` | `/api/escenarios` | Lista escenarios persistidos |
| `GET` | `/api/escenarios/:id` | Obtiene un escenario (`404` si no existe) |
| `POST` | `/api/escenarios` | Guarda un escenario (`400` si falla la validación) |

Errores en JSON: `{ "mensaje": "...", "detalles": [] }` (español, mismo criterio que `PanelAlertas`).

## Reglas de negocio

- Aporte periódico ≥ **5%** del ingreso mensual.
- Cuota inicial ≥ **10%** del valor del inmueble (por defecto 30%).
- Si el ahorro supera **60 meses**, se sugiere el Plan Acelerado (+20%).
- Si supera **180 meses (15 años)**, se muestra un **error** y hay que **revisar un plan alternativo** antes de guardar.

## Estructura

```
server/         API Express, repositorio y manejo de errores HTTP
src/components  UI (formulario, gráfico lazy, tarjetas, alertas)
src/lib         Cálculo, validación, cliente HTTP y normalización de montos
src/types       Contratos TypeScript
```
