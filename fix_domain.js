const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && !dirPath.includes('node_modules') && !dirPath.includes('.git')) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.html') || f.endsWith('.js')) {
      callback(dirPath);
    }
  });
}

let count = 0;
walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/wowtopgear\.com/g, 'wowtopgear.app');
  // Enforce ?v=20261008_v35 for cache bust
  newContent = newContent.replace(/\?v=20261008_v3[0-9]/g, '?v=20261008_v35');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    count++;
  }
});
console.log(`Replaced domain wowtopgear.app with wowtopgear.app in ${count} files.`);
