const fs = require('fs');

const transcriptPath = 'C:/Users/Juan/.gemini/antigravity/brain/c7ad08a3-7dbf-49a4-8542-b2265abcce4e/.system_generated/logs/transcript.jsonl';
const content = fs.readFileSync(transcriptPath, 'utf8');
const lines = content.split('\n');

let userHtml = '';
for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i]) continue;
  try {
    const o = JSON.parse(lines[i]);
    if (o.source === 'USER_EXPLICIT' && o.content && o.content.indexOf('builds-talent-tree-build-section__talent-trees') !== -1) {
      userHtml = o.content;
      break;
    }
  } catch(e) {}
}

if (!userHtml) {
  console.error('No se encontro el mensaje del usuario con los talentos.');
  process.exit(1);
}

const startMarker = '<div class="builds-talent-tree-build-section__talent-trees">';
const endMarker = '<div class="vertical-content builds-talent-tree-build-section__talent-tree-alternatives';

const startIdx = userHtml.indexOf(startMarker);
const endIdx = userHtml.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Marcadores no encontrados.');
  process.exit(1);
}

const treeHtml = userHtml.slice(startIdx, endIdx);
console.log('Talent Tree extraido con exito. Longitud:', treeHtml.length);

fs.writeFileSync('c:/Users/Juan/Documents/antigravity/focused-hypatia/js/data/archon_prot_tree_extracted.html', treeHtml, 'utf8');
console.log('Guardado en archon_prot_tree_extracted.html');
