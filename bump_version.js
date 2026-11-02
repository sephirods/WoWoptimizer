const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && !['node_modules', '.git', 'promo-video', 'staging', 'wasmer'].includes(f)) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.html')) {
      callback(dirPath);
    }
  });
}

// 1. Find the current highest version number (?v=23_vXX)
let currentMaxVersion = 0;
const versionRegex = /\?v=23_v(\d+)/g;

walkDir('.', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = versionRegex.exec(content)) !== null) {
    const ver = parseInt(match[1], 10);
    if (ver > currentMaxVersion) currentMaxVersion = ver;
  }
});

const nextVersion = currentMaxVersion > 0 ? currentMaxVersion + 1 : 72;
console.log(`Current version detected: v${currentMaxVersion} -> Bumping to: v${nextVersion}`);

let updatedFiles = 0;
let totalTagsUpdated = 0;

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanged = false;

  // Replace script tags (local only)
  let newContent = content.replace(/(<script\s+[^>]*src=["'])([^"']+)(["'][^>]*>)/gi, (match, p1, src, p3) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return match;
    }
    const cleanSrc = src.replace(/\?v=[^"'\s&]+/, '');
    const newSrc = `${cleanSrc}?v=23_v${nextVersion}`;
    if (src !== newSrc) {
      totalTagsUpdated++;
      fileChanged = true;
    }
    return `${p1}${newSrc}${p3}`;
  });

  // Replace local css link tags
  newContent = newContent.replace(/(<link\s+[^>]*href=["'])([^"']+\.css(?:\?[^"']*)?)(["'][^>]*>)/gi, (match, p1, href, p3) => {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      return match;
    }
    const cleanHref = href.replace(/\?v=[^"'\s&]+/, '');
    const newHref = `${cleanHref}?v=23_v${nextVersion}`;
    if (href !== newHref) {
      totalTagsUpdated++;
      fileChanged = true;
    }
    return `${p1}${newHref}${p3}`;
  });

  if (fileChanged) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updatedFiles++;
  }
});

console.log(`Successfully bumped version to v${nextVersion} across ${updatedFiles} HTML files (${totalTagsUpdated} tags updated).`);
