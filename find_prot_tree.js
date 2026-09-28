const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Juan/.gemini/antigravity/brain/c7ad08a3-7dbf-49a4-8542-b2265abcce4e/.system_generated/logs/transcript_full.jsonl')
});

rl.on('line', (line) => {
  if (line.includes('USER_EXPLICIT') && line.includes('builds-talent-tree-build-section__talent-trees')) {
    try {
      const o = JSON.parse(line);
      const sIdx = o.content.indexOf('<div class="builds-talent-tree-build-section__talent-trees">');
      const eIdx = o.content.indexOf('Alternative Class Talents Trees', sIdx);
      if (sIdx !== -1 && eIdx !== -1) {
        const sub = o.content.substring(sIdx, eIdx);
        const lastClose = sub.lastIndexOf('</div>');
        const cleanTree = sub.substring(0, lastClose);
        console.log('Tree found, length:', cleanTree.length);
        console.log('Has Protection:', cleanTree.includes('Protection'));
        console.log('Has Lightsmith:', cleanTree.includes('Lightsmith'));
        console.log('Has Herald of the Sun:', cleanTree.includes('Herald of the Sun'));
        if (cleanTree.includes('Protection') || cleanTree.includes('Lightsmith')) {
          fs.writeFileSync('c:/Users/Juan/Documents/antigravity/focused-hypatia/js/data/archon_prot_paladin_tree.html', cleanTree, 'utf8');
          console.log('SAVED PROT TREE!');
        }
      }
    } catch(e) {}
  }
});
