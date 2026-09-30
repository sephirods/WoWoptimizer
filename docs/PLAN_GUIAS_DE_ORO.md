# Plan Estratégico y Fuentes Verídicas para Guías de Oro (Goldmaking)
> Documento técnico y metodológico para integrar guías de economía, profesiones y farmeo de oro en WoWTopGear con datos 100% verídicos y actualizados en tiempo real.

---

## 1. El Problema de las Guías Tradicionales de Oro
El 95% de las guías de oro en YouTube y blogs quedan obsoletas a los pocos días de su publicación. Las razones son:
1. **Volatilidad de la Casa de Subastas (AH)**: Un farmeo rentable hoy puede perder todo su valor mañana si la oferta se satura.
2. **Subasta Unificada por Región (Commodities)**: Todos los materiales, menas, hierbas, consumibles y gemas comparten precios en **toda Europa** o en **toda América**. No existen precios aislados por servidor para estos ítems.
3. **Falta de rigor matemático**: Se basan en anécdotas (*"Hice 200k en 1 hora"*) sin considerar los costos de materiales, comisiones de subasta o tiempos reales de venta.

---

## 2. De Dónde Extraer Datos Verídicos y Oficiales

Para que WoWTopGear mantenga su estándar de rigor matemático, los datos deben provenir de fuentes auditables:

### Fuente A: API Oficial de Blizzard (Battle.net Connected Realm & Auction House API)
* **Qué es**: La API REST oficial que Blizzard provee a los desarrolladores de la comunidad.
* **Qué datos entrega**:
  * Archivo JSON horario con todos los lotes activos en la Casa de Subastas de la región (`us` y `eu`).
  * Precios mínimos, medianas y volumen disponible para cada ID de objeto (Hierbas, Menas, Frascos, Pociones, Cuero, Telas, Gemas).
* **Costo**: 100% gratuita. Solo requiere registrar una aplicación en el portal de desarrolladores de Blizzard (`develop.battle.net`).

### Fuente B: Saddlebag Exchange & The Undermine Journal (Oribos Exchange)
* **Qué es**: Plataformas comunitarias de código abierto y APIs abiertas que procesan los volcados de Blizzard y calculan:
  * **Velocidad de venta (Sale Rate)**: Probabilidad porcentual de que un ítem se venda en menos de 24 horas.
  * **Márgenes de beneficio de fabricación (Crafting Profit Margin)**: Cálculo automatizado de `(Precio de Venta) - (Costo de Materiales + Comisión)`.
* **Uso en WoWTopGear**: Se pueden consumir sus endpoints públicos o scripts ligeros para alimentar tablas dinámicas.

---

## 3. Arquitectura Propuesta de las Guías en WoWTopGear

En lugar de textos estáticos que envejecen mal, WoWTopGear implementará **Módulos Analíticos de Oro**:

### Módulo 1: Calculadora de Ganancia Neta por Profesión (Crafting Profit Matrix)
* **Cómo funciona**:
  * El usuario selecciona su profesión (ej. *Alquimia*, *Joyería*, *Encantamiento*).
  * La herramienta compara en tiempo real el coste de los materiales según la AH regional versus el precio de venta del consumible terminado.
  * Muestra una tabla ordenada de mayor a menor beneficio neto por crafteo:
    * Ejemplo: *Frasco de Poder Supremo*: Costo 420g | Venta 580g | **Ganancia neta: +160g / crafteo**.
* **Filtros**: Permite activar o desactivar estadísticas de profesión como *Multicraft* (Fabricación múltiple) e *Ingenuity* (Ingenio/Ahorro de materiales).

### Módulo 2: Guías de Puntos de Conocimiento (Knowledge Points Builds)
* **Cómo funciona**:
  * En *World of Warcraft: Midnight*, las profesiones tienen árboles de especialización que definen qué recetas puedes crear con calidad máxima (Rango 5 / Oro).
  * Presentar árboles interactivos (similares a los árboles de talentos que ya tenemos para las clases) con rutas recomendadas:
    * *"Ruta de Oro Rápido: Primeros 60 puntos de conocimiento en Alquimia"*.
    * *"Ruta de Crafteo de Equipo BiS: Cómo maximizar Herrería para cobrar propinas por pedidos personales"*.

### Módulo 3: Radar de Materiales de Farmeo (Gathering Market Index)
* **Cómo funciona**:
  * Para jugadores que prefieren recolectar (Minería, Herboristería, Desuello).
  * Tabla con el precio actual por unidad de los materiales de Midnight en la región y el rendimiento promedio estimado por hora de ruta optimizada.

---

## 4. Fases de Implementación Futura

| Fase | Tarea | Requisitos Previos |
| :--- | :--- | :--- |
| **Fase 1** | Registrar Client ID de Blizzard Developer API y crear script de sincronización horaria de precios de commodities en `js/data/ah_prices.json`. | Cuenta Blizzard Dev. |
| **Fase 2** | Diseñar la página `gold/index.html` con soporte bilingüe (`EN` / `ES`) y layout móvil-first. | Estructura modular estándar. |
| **Fase 3** | Desarrollar el componente interactivo `js/ui/gold_matrix_ui.js` para calcular beneficios de crafteo en vivo. | Precios de materiales en JSON. |
| **Fase 4** | Añadir guías visuales de Árboles de Conocimiento de Profesión. | Datos de nodos de profesión de Wowhead. |
| **Fase 5** | Conectar con el Sitemap, SEO bilingüe y `llms.txt`. | Validar en Search Console. |
