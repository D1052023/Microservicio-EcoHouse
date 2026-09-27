# EcoHouse — Simulación de Ahorro / Financiación

Interfaz web para que jóvenes del Caribe colombiano estimen cuánto tardarán en completar la **cuota inicial** de su primera vivienda, según ingreso, ahorro, ciudad y plan de aportes.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm test` | Pruebas unitarias (Vitest + Testing Library) |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build |

## Qué incluye

- Formulario con validación en tiempo real (regla del **5%** del ingreso).
- Cuota inicial mínima del **10%** (slider, valor por defecto **30%**).
- Gráfico de proyección ahorro vs meta (Recharts).
- Planes alternativos; **Plan Acelerado (+20%)** si el ahorro supera 60 meses.
- Guardado local de escenarios (UUID simulado).

## Estructura

```
src/
  components/   Formulario, gráfico, tarjetas, alertas e interfaz principal
  lib/          Cálculo, formato COP y validaciones
  types/        Contratos TypeScript del escenario
```
