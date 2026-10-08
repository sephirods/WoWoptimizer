const fs = require('fs');
const path = require('path');

const CONFIG_FILE = 'season_config.json';

// Target directories (we specifically exclude js/data and js/engine to protect logic and news)
const DIRECTORIES = ['.', 'classes', 'js/ui'];
const EXTENSIONS = ['.html', '.js'];
const IGNORE_FILES = ['wow_news_data.js', 'news_fetcher.js'];

// Read current config
let config;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
} catch (err) {
  console.error("Error reading season_config.json. Make sure the file exists.");
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
let newPatch = null;
let newVersion = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--patch') newPatch = args[i + 1];
  if (args[i] === '--version') newVersion = args[i + 1];
}

if (!newPatch || !newVersion) {
  console.log(`\n=========================================`);
  console.log(` WOWTOPGEAR: SEASON UPDATER SCRIPT`);
  console.log(`=========================================`);
  console.log(`Current Patch: ${config.current_patch}`);
  console.log(`Current Cache Version: ${config.current_version}`);
  console.log(`\nUsage: node update_season.js --patch "12.2.0" --version "v37"`);
  process.exit(1);
}

const oldPatch = config.current_patch;
const oldVersion = config.current_version;

// Escape old patch for regex use
const op = oldPatch.replace(/\./g, '\\.');

// Get current date string for cache busting (YYYYMMDD)
const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

// Highly specific replacements to protect unrelated content
const REPLACEMENTS = [
  { regex: new RegExp(`\\(${op}\\)`, 'g'), replace: `(${newPatch})` },
  { regex: new RegExp(`Parche ${op}(?!\\.)`, 'g'), replace: `Parche ${newPatch}` },
  { regex: new RegExp(`PARCHE ${op}(?!\\.)`, 'g'), replace: `PARCHE ${newPatch}` },
  { regex: new RegExp(`Patch ${op}(?!\\.)`, 'g'), replace: `Patch ${newPatch}` },
  { regex: new RegExp(`PATCH ${op}(?!\\.)`, 'g'), replace: `PATCH ${newPatch}` },
  { regex: new RegExp(`Midnight ${op}(?!\\.)`, 'g'), replace: `Midnight ${newPatch}` },
  { regex: new RegExp(`MIDNIGHT ${op}(?!\\.)`, 'g'), replace: `MIDNIGHT ${newPatch}` },
  { regex: new RegExp(`${op} S2`, 'g'), replace: `${newPatch} S2` },
  { regex: new RegExp(`${op}(?=\\s*\\|\\s*WoWTopGear)`, 'g'), replace: newPatch }, // Matches "12.1.5 | WoWTopGear"
  
  // Cache busting replacements
  { regex: /v=\d+_v\d+/g, replace: `v=${dateStr}_${newVersion}` },
  { regex: /\?v=v\d+/g, replace: `?v=${newVersion}` }
];

let filesChanged = 0;

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (IGNORE_FILES.includes(file)) return;
    
    if (stat.isDirectory()) {
      // Recurse into classes subdirectories
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
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

// Execute replacement
console.log(`Updating from ${oldPatch} (${oldVersion}) to ${newPatch} (${newVersion})...`);
DIRECTORIES.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});

// Save new config
config.current_patch = newPatch;
config.current_version = newVersion;
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

console.log(`\nFinished! Successfully updated ${filesChanged} files.`);
console.log(`season_config.json has been updated.`);
