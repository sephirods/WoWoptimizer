const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && !dirPath.includes('node_modules') && !dirPath.includes('.git')) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.html')) {
      callback(dirPath);
    }
  });
}

let count = 0;
walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\?v=20261008_v32/g, '?v=20261008_v33');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    count++;
  }
});
console.log(`Bumped general version to v33 in ${count} files.`);
