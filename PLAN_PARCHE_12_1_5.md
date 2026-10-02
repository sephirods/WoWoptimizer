# Plan de Acción: Actualización Parche 12.1.5 (World of Warcraft: Midnight — Season 2)

**Fecha de Lanzamiento Oficial:** Octubre 2026 (Semana del 7 al 13 de Octubre)  
**Contexto del Parche:** Parche menor 12.1.5 de Midnight Season 2.  
**Cambio Clave:** Incremento del techo de nivel de objeto (ilvl) a **344** mediante la nueva banda de un solo jefe (*The Unbinding of Kith'ix*) y consolidación oficial de las **Ascendant Venomstones**.

---

## 1. Motor de Escalado Matemático e ilvl

- [ ] **Extensión de Techo a ilvl 344 (`js/engine/item_scaler.js`)**:
  - Asegurar que la fórmula cuadrática de estadísticas secundarias (`ilvl² * coef`) y las estadísticas primarias/aguante escalen con precisión hasta nivel de objeto **344**.
- [ ] **Ampliación de Selectores y Controles de UI (`js/ui/item_modal_ui.js` y `gearsim.html`)**:
  - Ajustar los atributos `max` de inputs numéricos y sliders de ilvl de `334/340` a `344`.
- [ ] **Consolidación de Ascendant Venomstones (`js/engine/upgrade_tracks.js`)**:
  - Migrar el toggle de Venomstones de estado de prueba PTR a regla oficial de temporada para armas, abalorios y collares.

---

## 2. Catálogo de Objetos y Armaduras "Cantrip"

- [ ] **Piezas de Armadura "Cantrip" (`js/data/classes_*.js`)**:
  - Integrar las 4 nuevas armaduras únicas con efectos pasivos especiales para cada tipo:
    - Placas (Plate)
    - Malla (Mail)
    - Cuero (Leather)
    - Tela (Cloth)
- [ ] **Tabla de Botín de *The Unbinding of Kith'ix* (`js/data/trinkets.js` y clases)**:
  - Añadir los abalorios y armas únicas de Kith'ix con sus IDs oficiales de Wowhead, iconos y estadísticas base a 344 en dificultad Mítica.

---

## 3. Parser de SimulationCraft (/simc)

- [ ] **Compatibilidad de Nivel de Objeto (`js/engine/simc_parser.js`)**:
  - Asegurar que el parser acepte y mantenga piezas importadas con `ilvl=344` sin truncarlas ni limitarlas a 334.
- [ ] **Bonus IDs de Kith'ix**:
  - Mapear los modificadores de dificultad (Mítico 344, Heroico 331) para que Wowhead resuelva los tooltips con el nivel de objeto exacto.

---

## 4. Textos, SEO y Bilingüismo (EN / ES / MX)

- [ ] **Actualización de Textos de Ayuda (`js/ui/i18n.js`)**:
  - Actualizar los badges de "Max ilvl Sim" e información del modal de ayuda `(?)` reflejando el nuevo límite de 344.
  - Asegurar traducciones precisas en los 3 idiomas (`en`, `es`, `mx`).

---

## 5. Pruebas y Despliegue

- [ ] **Validación Matemática**:
  - Comprobar que los rendimientos decrecientes (DR) de secundarias se calculen correctamente con los nuevos totales de estadísticas a 344.
- [ ] **Despliegue a Producción**:
  - Incrementar versión global de scripts (`?v=...`).
  - Commit y push a `origin/main` bajo autorización explícita.
