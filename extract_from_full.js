const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Juan/.gemini/antigravity/brain/c7ad08a3-7dbf-49a4-8542-b2265abcce4e/.system_generated/logs/transcript_full.jsonl')
});

let found = false;

rl.on('line', (line) => {
  if (found || !line.includes('builds-talent-tree-build-section__talent-trees')) return;
  try {
    const o = JSON.parse(line);
    if (o.source === 'USER_EXPLICIT' && o.content) {
      const startMarker = '<div class="builds-talent-tree-build-section__talent-trees">';
      const sIdx = o.content.indexOf(startMarker);
      if (sIdx !== -1) {
        const eIdx = o.content.indexOf('Alternative Class Talents Trees', sIdx);
        if (eIdx !== -1) {
          const sub = o.content.substring(sIdx, eIdx);
          const lastClose = sub.lastIndexOf('</div>');
          const cleanTree = sub.substring(0, lastClose);
          fs.writeFileSync('c:/Users/Juan/Documents/antigravity/focused-hypatia/js/data/archon_prot_paladin_tree.html', cleanTree, 'utf8');
          console.log('SUCCESS: Extracted Archon Tree HTML! Size:', cleanTree.length);
          found = true;
        }
      }
    }
  } catch(e) {}
});

rl.on('close', () => {
  if (!found) console.log('Not found in transcript_full');
});
