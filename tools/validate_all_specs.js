const fs = require('fs');
const vm = require('vm');

const sandbox = { window: {} };
vm.createContext(sandbox);

// Cargar bases de datos simulando el navegador
const archonCode = fs.readFileSync('C:/Users/Juan/Downloads/planet coaster/archon_data.js', 'utf8');
vm.runInContext(archonCode, sandbox);

const plate = fs.readFileSync('js/data/classes_plate.js', 'utf8');
const mail = fs.readFileSync('js/data/classes_mail.js', 'utf8');
const leather = fs.readFileSync('js/data/classes_leather.js', 'utf8');
const cloth = fs.readFileSync('js/data/classes_cloth.js', 'utf8');
vm.runInContext(plate + mail + leather + cloth, sandbox);

const classGroups = [
  sandbox.window.WOW_CLASSES_PLATE,
  sandbox.window.WOW_CLASSES_MAIL,
  sandbox.window.WOW_CLASSES_LEATHER,
  sandbox.window.WOW_CLASSES_CLOTH
];

let totalSpecs = 0;
let errors = [];

console.log('=== INICIANDO VALIDACIÓN AUTOMÁTICA DE 40 ESPECIALIZACIONES ===\n');

for (const group of classGroups) {
  for (const classKey in group) {
    const classData = group[classKey];
    const cp = sandbox.window.ARCHON_PRESETS[classKey] || {};
    
    for (const spec of classData.specs) {
      totalSpecs++;
      const specId = spec.id;
      
      // Simular la lógica de Target UI
      const specData = cp[specId] || cp[`${specId}_${classKey}`] || cp[`${classKey}_${specId}`] || cp[specId.split('_')[0]] || cp[specId.replace(/_.*/, '')] ||
                       (specId === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                       (specId === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                       (specId === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                       (specId === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman'])) ||
                       (specId === 'restoration_shaman' && cp['restoration']) ||
                       (specId === 'restoration_druid' && cp['restoration']) ||
                       (specId === 'prot_warrior' && cp['protection']) ||
                       (specId === 'protection_paladin' && cp['protection']) ||
                       (specId === 'holy_paladin' && cp['holy']) ||
                       (specId === 'holy_priest' && cp['holy']) ||
                       (specId === 'frost_dk' && cp['frost']) ||
                       (specId === 'frost_mage' && cp['frost']);
                       
      if (!specData) {
        errors.push(`[ERROR GRAVE] No se encontraron estadísticas en Archon para: ${classData.name} ${spec.name} (ID: ${specId})`);
        continue;
      }
      
      const modes = ['raid', 'mplus'];
      for (const mode of modes) {
        if (!specData[mode]) {
          errors.push(`[ERROR] Faltan datos del modo ${mode} para: ${classData.name} ${spec.name}`);
          continue;
        }
        
        const rawHeroName = specData[mode].metaHeroTree || specData[mode].heroTree;
        if (!rawHeroName) {
          errors.push(`[ADVERTENCIA] Archon no tiene Árbol Héroe para: ${classData.name} ${spec.name} (${mode})`);
          continue;
        }
        
        const metaTree = rawHeroName.toLowerCase().replace(/[^a-z0-9]/g, '');
        let matched = false;
        for (const ht of spec.heroTrees) {
          const cleanHtId = ht.id.replace(/[^a-z0-9]/g, '');
          if (cleanHtId === metaTree || metaTree.includes(cleanHtId) || cleanHtId.includes(metaTree)) {
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          errors.push(`[ERROR DE META] El Árbol Héroe "${rawHeroName}" de Archon no coincidió con ningún árbol interno de ${classData.name} ${spec.name} en ${mode}`);
        }
      }
    }
  }
}

console.log(`Se escanearon ${totalSpecs} especializaciones.`);
if (errors.length === 0) {
  console.log('\n✅ TODO PERFECTO: Las 40 especializaciones enlazan sus estadísticas, modos y árboles Héroe META correctamente.');
} else {
  console.log('\n❌ SE ENCONTRARON LOS SIGUIENTES PROBLEMAS:');
  errors.forEach(e => console.log(e));
}
