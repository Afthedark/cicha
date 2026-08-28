import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src/pages/public'));
let count = 0;

files.forEach((f) => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;

  // Transform dark hero banners into bright Aegean Sky banners
  content = content
    .replace(/bg-gradient-to-br from-cicha-navy via-cicha-navy-dark to-cicha-navy-deep text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/g, 'relative overflow-hidden bg-gradient-to-br from-cicha-navy via-cicha-aegean to-cicha-sky text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky-light shadow-lg')
    .replace(/bg-gradient-to-br from-cicha-navy via-cicha-navy-dark to-cicha-navy-deep text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky/g, 'relative overflow-hidden bg-gradient-to-br from-cicha-navy via-cicha-aegean to-cicha-sky text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky-light shadow-lg')
    .replace(/border-amber-500/g, 'border-cicha-sky')
    .replace(/text-amber-400/g, 'text-cicha-sky')
    .replace(/text-amber-300/g, 'text-cicha-sky-light');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log('Upgraded to Aegean Sky Palette:', f);
  }
});

console.log(`Successfully upgraded ${count} public pages.`);
