const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['.', 'classes', 'js', 'js/engine', 'js/ui', 'js/data'];
const EXTENSIONS = ['.html', '.js'];

// Replacements
const REPLACEMENTS = [
  { regex: /\(12\.1\)/g, replace: '(12.1.5)' },
  { regex: /Parche 12\.1(?!\.)/g, replace: 'Parche 12.1.5' },
  { regex: /Patch 12\.1(?!\.)/g, replace: 'Patch 12.1.5' },
  { regex: /Midnight 12\.1(?!\.)/g, replace: 'Midnight 12.1.5' },
  { regex: /12\.1 S2/g, replace: '12.1.5 S2' },
  { regex: /12\.1(?=\s*\|\s*WoWTopGear)/g, replace: '12.1.5' },
  // Version bump
  { regex: /v=20261008_v38/g, replace: 'v=20261008_v38' },
  { regex: /v=20261008_v38/g, replace: 'v=20261008_v38' }
];

let filesChanged = 0;

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (fullPath.startsWith('classes')) {
        processDirectory(fullPath);
      }
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      REPLACEMENTS.forEach(rule => {
        content = content.replace(rule.regex, rule.replace);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        filesChanged++;
        console.log('Updated:', fullPath);
      }
    }
  });
}

DIRECTORIES.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});

console.log(`\nFinished! Updated ${filesChanged} files.`);
