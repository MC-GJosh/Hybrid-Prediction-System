const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'pages', 'swimmers', '[id].vue'),
  path.join(__dirname, '..', 'pages', 'predictions', 'index.vue')
];

const replacements = {
  'bg-gray-950': 'bg-background',
  'bg-gray-900': 'bg-surface',
  'border-gray-800': 'border-border',
  'border-gray-700': 'border-border',
  'text-white': 'text-primary',
  'text-gray-400': 'text-secondary',
  'text-gray-300': 'text-secondary',
  'text-gray-500': 'text-secondary',
  'bg-gray-800': 'bg-surface-hover',
  'text-blue-400': 'text-primary',
  'text-green-400': 'text-primary',
  'text-purple-400': 'text-primary',
  'text-yellow-400': 'text-primary',
  'text-red-400': 'text-red-600 dark:text-red-400',
  'border-blue-500': 'border-primary',
  'border-green-500': 'border-primary',
  'border-yellow-500': 'border-primary',
  'bg-blue-600': 'bg-btn-primary',
  'hover:bg-blue-700': 'hover:bg-btn-primary-hover text-btn-primary-text',
  'bg-blue-500/10': 'bg-surface-hover',
  'bg-green-500/10': 'bg-surface-hover',
  'bg-purple-500/10': 'bg-surface-hover',
  'text-blue-500': 'text-primary',
  'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500': 'text-primary',
  'bg-gradient-to-r from-blue-600 to-purple-600': 'bg-btn-primary',
  'hover:from-blue-700 hover:to-purple-700': 'hover:bg-btn-primary-hover text-btn-primary-text',
};

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove Navbar
  content = content.replace(/<!-- Navbar -->\s*<nav[\s\S]*?<\/nav>/g, '');
  
  // Apply replacements
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, value);
  }

  // Remove duplicate text-primary text-btn-primary-text etc if accidentally double-applied
  content = content.replace(/text-btn-primary-text text-btn-primary-text/g, 'text-btn-primary-text');
  content = content.replace(/text-primary text-primary/g, 'text-primary');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${filePath}`);
}

for (const file of targetFiles) {
  processFile(file);
}
