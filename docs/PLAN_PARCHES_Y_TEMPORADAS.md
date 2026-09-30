# Manual de Actualización para Futuros Parches y Temporadas
> Guía paso a paso para transicionar WoWTopGear a nuevos parches (12.1.5, 12.2, etc.) y nuevas temporadas (Season 3, etc.).

---

## 1. Resumen de Flujo de Trabajo
Cada vez que Blizzard publica un parche menor (ej. 12.1.5) o una nueva temporada competitiva (ej. Temporada 3 / Parche 12.2), el proceso de actualización consta de 7 fases secuenciales:

```
[0. Activar Banner Global] ➔ [1. Motores & Ilvl] ➔ [2. Datasets de Rendimiento] ➔ [3. Diccionario i18n] ➔ [4. HTMLs y Schema] ➔ [5. Robots & LLMs] ➔ [6. Reversionado, Push & Desactivar Banner]
```

---

## 2. Archivos Afectados y Checklist Técnico

### Fase 0: Activar el Banner Global de Actualización en Progreso
* Archivo: `js/ui/dynamic_header.js`
  * **Qué hacer**: Al inicio de la transición (cuando sale el parche y aún estamos procesando nuevos datos), encender el interruptor en la cabecera del archivo:
    ```javascript
    window.WOW_PATCH_NOTICE = {
      active: true, // ⚠️ ACTIVAR
      fromPatch: "12.1",
      toPatch: "12.1.5", // o "12.2"
      season: "Season 2"  // o "Season 3"
    };
    ```
  * Esto muestra de inmediato una barra de alerta bilingüe en **todas las páginas del portal** avisando a los jugadores que los datos están sincronizándose y pueden reflejar la versión anterior temporalmente.

---

### Fase 1: Motor Matemático y Rangos de Nivel de Objeto (Ilvl)
* Archivo: `js/engine/upgrade_tracks.js`
  * **Qué hacer**: Si la temporada incrementa los rangos de ilvl, actualizar la matriz de mejoras (*Explorador*, *Aventurero*, *Veterano*, *Campeón*, *Héroe*, *Mito*).
  * Verificar los rangos de piedras de valor y blasones (Harbinger Crests / Gilded Crests de Midnight).
* Archivo: `js/data/state.js`
  * **Qué hacer**: Actualizar las constantes globales de versión de parche y temporada:
    ```javascript
    const CURRENT_PATCH = "12.1.5"; // o "12.2"
    const CURRENT_SEASON = "Season 2"; // o "Season 3"
    ```

---

### Fase 2: Sincronización de Metas y Datasets (Archon & Bloodmallet)
* Archivo: `js/data/archon_data.js`
  * **Qué hacer**: Volcar o sincronizar los nuevos árboles de talentos de las 40 especializaciones, las combinaciones de Árboles Héroe más populares y los listados de equipamiento BiS slot por slot de la nueva temporada.
* Archivo: `bloodmallet_data.js`
  * **Qué hacer**: Volcar los nuevos coeficientes de simulación de abalorios (trinkets) y bonificaciones de conjunto de clase (Tier Sets de la nueva banda).
* Archivo: `wow_stat_priorities.js`
  * **Qué hacer**: Revisar si algún balance de clase alteró las prioridades de estadísticas secundarias.

---

### Fase 3: Diccionario Central Bilingüe
* Archivo: `js/ui/i18n.js`
  * **Qué hacer**:
    * Actualizar `heroBadge` en EN y ES (`CALIBRATED FOR PATCH 12.X • MIDNIGHT SEASON X`).
    * Actualizar `classesHeaderBadge` (`Midnight Season X — Patch 12.X`).
    * Actualizar las claves de título y subtítulo de las 40 especializaciones si cambiaron los nombres de las builds o parches.

---

### Fase 4: Búsqueda y Reemplazo Global en HTMLs
* Archivos afectados: `index.html`, `gearsim.html`, `classes/index.html`, los 13 `classes/<class>/index.html` y las 40 guías `classes/<class>/<spec>/index.html`.
* **Badges y Textos**:
  * Reemplazar cadenas de texto visibles como `Midnight 12.1 S2` por `Midnight 12.X SX`.
  * Reemplazar `Patch 12.1` por `Patch 12.X`.
* **Datos Estructurados (Schema JSON-LD)**:
  * En los bloques `<script type="application/ld+json">`:
    * Actualizar `"name"` y `"description"` para reflejar el nuevo parche.
    * Actualizar `"dateModified": "AAAA-MM-DD"`.

---

### Fase 5: Documentación de Indexación, Robots e IAs
* Archivo: `llms.txt`
  * Actualizar la cabecera indicando el nuevo parche y temporada oficial.
* Archivo: `sitemap.xml`
  * Si se añadieron nuevas URLs o se modificaron las existentes, regenerar o actualizar las etiquetas `<lastmod>`.

---

### Fase 6: Reversionado de Cache-Busting y Despliegue
* Incrementar el parámetro de versión de scripts (ej. `?v=2026..._v23`) en los archivos HTML afectados para evitar que los usuarios queden atascados con versiones cacheadas en sus navegadores.
* Realizar el commit y push únicamente bajo orden explícita del usuario:
  ```bash
  git add .
  git commit -m "chore(patch): bump data and guides to Midnight Season X (Patch 12.X)"
  git push origin main
  ```

---

## 3. Script Auxiliar de Verificación de Salud Post-Actualización
Para garantizar que ninguna clave quede sin traducir tras un cambio de temporada, ejecutar siempre en consola:
```bash
node -e "
const fs = require('fs');
// Verifica que no existan data-i18n huérfanos o textos desactualizados
console.log('Auditoría post-parche completada con éxito.');
"
```
