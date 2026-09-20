# Lista de Pendientes & Mejoras Futuras (TODO.md)

## 1. Seguridad, Anti-Copia & Protección de Código (Frontend Hardening)
- [ ] **Minificación & Ofuscación de JavaScript**:
  - Implementar script o pipeline de compilación (vía Terser / JavaScript-Obfuscator) para anonimizar nombres de variables, métodos de la lógica matemática (`optimizer.js`, `simc_parser.js`, `results_ui.js`) y codificar strings.
  - Ofuscar archivos clave del motor algorítmico para impedir la clonación directa o comprensión de la lógica interna mediante inspección de red / DevTools.
- [ ] **Empaquetado de Módulos (Bundling)**:
  - Evaluar la generación de un bundle unificado y comprimido para producción (conservando los módulos fuente limpios y legibles para desarrollo).
- [ ] **Medidas Anti-Inspección (Opcional)**:
  - Trampas para depuradores (`debugger;` loops controlados) o prevención de descarga directa automatizada si se considera necesario en el futuro.

## 2. Optimizaciones de Rendimiento & Carga
- [ ] Mantener el control estricto de versionado de scripts (`?v=...`) en cada despliegue para asegurar la invalidación de caché.
- [ ] Monitoreo continuo de tamaño de archivos para cumplir la directiva de < 1.000 líneas por módulo.
