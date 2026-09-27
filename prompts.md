# Historial de Prompts — EcoHouse

Este documento registra el historial de prompts utilizados durante el proceso iterativo de desarrollo del componente "Interfaz de Simulación de Ahorro/Financiación". Se detallan en orden cronológico los comandos enviados para generar el código base y sus posteriores refinamientos.

## Prompt 1 — Generación inicial del componente

Objetivo: generar el componente base desde cero.

```text
Quiero que generes el código de un componente llamado: Interfaz de Simulación de Ahorro/Financiación
Tipo: UI
Lenguaje/Framework preferido: React con TypeScript, Tailwind CSS, componentes de Lucide React y Recharts para gráficos.

Especificación del componente:
- Propósito: Pantalla interactiva que permite a los jóvenes configurar su ingreso, ahorro y ciudad para estimar el tiempo necesario para completar la cuota inicial de su primera vivienda en el norte de Colombia, mostrando opciones y planes alternativos.

- Entradas (Campos del formulario):
  1. ingresoMensual (Número en COP, ej: 2500000)
  2. ahorroInicial (Número en COP, ej: 1000000)
  3. aportePeriodico (Número en COP, ej: 200000)
  4. frecuencia (Dropdown: Mensual / Quincenal)
  5. ciudad (Dropdown: Cartagena / Barranquilla / Santa Marta)
  6. valorInmueble (Número en COP, ej: 150000000)
  7. porcentajeCuotaInicial (Slider/Input: Mínimo 10%, por defecto 30%)

- Salidas (UI y Estado):
  - ID de escenario generado (UUID simulado)
  - Tiempo estimado de ahorro (expresado en meses y años)
  - Gráfico de barra/línea con la proyección del ahorro acumulado mes a mes vs meta
  - Resumen de tarjetas con Planes Alternativos (ej: Plan Acelerado con +20% de aporte)
  - Panel de alertas / advertencias según reglas de negocio

- Reglas de negocio:
  1. El aportePeriodico debe ser como mínimo el 5% del ingresoMensual. Si es menor, se debe bloquear la simulación y mostrar una alerta en rojo.
  2. La cuota inicial no puede ser inferior al 10% del valorInmueble.
  3. Si el tiempo estimado de ahorro supera los 60 meses (5 años), el sistema debe desplegar automáticamente una tarjeta sugerida con un "Plan Acelerado".

- Flujo principal:
  1. El usuario ingresa a la interfaz con valores por defecto inicializados.
  2. Completa o ajusta los campos del formulario con validación en tiempo real.
  3. Hace clic en "Calcular Simulación" (o activa el cálculo automático).
  4. La UI renderiza las métricas principales (tiempo en meses) y el gráfico de proyección con Recharts.
  5. Si el escenario es válido, permite hacer clic en "Guardar Escenario".

- RNF clave:
  - Tiempos de renderizado y respuesta visual < 800 ms.
  - Diseño totalmente responsive (Mobile-First) y limpio.
  - Cumplimiento de accesibilidad WCAG 2.1 AA (contraste adecuado, etiquetas ARIA en formularios e inputs).

- Criterios de Aceptación y Escenarios de Prueba:

  * Escenario de Éxito (Caso Válido):
    - Dado un usuario con ingresoMensual = $2.500.000, aportePeriodico = $200.000, valorInmueble = $150.000.000 y ciudad = "Barranquilla",
    - Cuando presiona "Calcular Simulación",
    - Entonces el sistema muestra en menos de 800 ms el tiempo estimado en meses, el gráfico de proyección interactivo y la recomendación de un plan alternativo.

  * Escenario de Fallo (Regla del 5% Violada):
    - Dado un usuario con ingresoMensual = $3.000.000 y un aportePeriodico de $50.000 (menor al 5% requerido = $150.000),
    - Cuando intenta simular o cambia el campo,
    - Entonces el botón de cálculo se deshabilita y se muestra un mensaje de error: "El aporte periódico debe ser de al menos el 5% de tus ingresos ($150.000 COP)".

Requerimientos adicionales para el código:
- Código modular en TypeScript, separado en componentes limpios (ej: Formulario, GraficoProyeccion, TarjetasResumen).
- Uso de componentes visuales limpios tipo Shadcn/UI o Tailwind puro con colores modernos (azules/verdes para finanzas).
- Incluir un archivo de pruebas unitarias simuladas (ej: Jest / React Testing Library) para verificar la función de cálculo y las reglas de validación del 5%.
- Incluir un README.md corto explicativo con instrucciones de instalación y ejecución (`npm install`, `npm run dev`).
```

## Prompt 2 — Revisión y ajustes

Objetivo: corregir hallazgos de la revisión de código (arquitectura, reglas de negocio, validaciones, documentación, pruebas y rendimiento).

```text
El código generado del simulador EcoHouse funciona y pasa sus pruebas, pero le faltan los siguientes ajustes. Corrígelos todos:

1. Arquitectura: el proyecto se llama "Microservicio-EcoHouse" pero es una SPA de React 100% frontend, sin API ni backend, y persiste los escenarios solo en localStorage del navegador. Aclara en el README si el alcance real es únicamente frontend, o agrega la capa de backend (API REST con persistencia real, validación server-side y manejo de errores HTTP) si el nombre "microservicio" implica esa arquitectura.

2. Regla del 5% de aporte mínimo: actualmente un plan puede superar 200+ meses (18+ años) y seguir considerándose "válido" mientras cumpla el 5% del ingreso. Agrega un umbral máximo razonable (ej. 15-20 años) que, al superarse, muestre una alerta de tipo "error" (no solo "advertencia") y obligue a revisar un plan alternativo antes de guardar el escenario.

3. Validación de inputs numéricos: los campos de moneda (ingresoMensual, ahorroInicial, valorInmueble) usan el atributo HTML `min` como única barrera, que el navegador puede ignorar al pegar o escribir un valor negativo antes del blur. Agrega validación explícita en el onChange (o en un normalizador) que impida valores negativos o no numéricos en tiempo real, no solo al enviar el formulario.

4. Documentación del código: agrega comentarios JSDoc a las funciones de negocio en simulacion.ts y validacion.ts (calcularCuotaInicial, calcularMesesParaMeta, construirPlanes, cumpleReglaAporteMinimo, etc.), describiendo parámetros, unidades (COP, meses) y reglas que implementan.

5. Cobertura de pruebas: agrega pruebas unitarias para los componentes MetricasPrincipales, TarjetasResumen, PanelAlertas y GraficoProyeccion (actualmente sin tests propios), y una prueba de accesibilidad automatizada (ej. con jest-axe) sobre el formulario y el panel de resultados.

6. Rendimiento del bundle: el build de producción genera un chunk de ~573 KB (162 KB gzip), por encima del límite recomendado de Vite. Aplica code-splitting (lazy loading de GraficoProyeccion con React.lazy/Suspense, ya que depende de Recharts) para reducir el tamaño del chunk inicial.

Todos los mensajes de error y alertas deben mantenerse en español, con el mismo estilo y componentes (PanelAlertas) ya usados en el proyecto.
```

## Resultado

| Prompt | Resultado esperado |
| :--- | :--- |
| Prompt 1 | Obtener un prototipo funcional del componente de simulación en React con TypeScript, validaciones básicas en tiempo real, pruebas unitarias y estilos iniciales utilizando Tailwind CSS y Recharts. |
| Prompt 2 | Corregir las vulnerabilidades en los inputs numéricos, optimizar el rendimiento del build separando componentes pesados (lazy loading), asegurar una correcta cobertura de pruebas (incluyendo accesibilidad), incluir un backend/API en concordancia con el nombre y añadir límites de tiempo más estrictos a los planes. |
