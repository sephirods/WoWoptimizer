const fs = require('fs');

let targetUi = fs.readFileSync('js/ui/target_ui.js', 'utf8');

const regex = /const isMeta = metaTree \? \(ht\.id === metaTree \|\| metaTree\.includes\(ht\.id\) \|\| ht\.id\.includes\(metaTree\)\) : \(ht === specData\.heroTrees\[0\]\);/g;
const replacement = `const cleanHtId = ht.id.replace(/[^a-z0-9]/g, '');
          const isMeta = metaTree ? (cleanHtId === metaTree || metaTree.includes(cleanHtId) || cleanHtId.includes(metaTree)) : (ht === specData.heroTrees[0]);`;

targetUi = targetUi.replace(regex, replacement);

const regex2 = /const isMeta = metaTree \? \(tree\.id === metaTree \|\| metaTree\.includes\(tree\.id\) \|\| tree\.id\.includes\(metaTree\)\) : \(tree === specData\.heroTrees\[0\]\);/g;
const replacement2 = `const cleanTreeId = tree.id.replace(/[^a-z0-9]/g, '');
    const isMeta = metaTree ? (cleanTreeId === metaTree || metaTree.includes(cleanTreeId) || cleanTreeId.includes(metaTree)) : (tree === specData.heroTrees[0]);`;

targetUi = targetUi.replace(regex2, replacement2);

fs.writeFileSync('js/ui/target_ui.js', targetUi);
console.log('Fixed target_ui.js hero tree matching');
