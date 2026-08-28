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

const files = walk(path.join(__dirname, 'src'));
let count = 0;

files.forEach((f) => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;

  content = content
    .replace(/text-\[#0B2545\]/g, 'text-cicha-navy')
    .replace(/bg-\[#0B2545\]/g, 'bg-cicha-navy')
    .replace(/border-\[#0B2545\]/g, 'border-cicha-navy')
    .replace(/from-\[#0B2545\]/g, 'from-cicha-navy')
    .replace(/via-\[#0B2545\]/g, 'via-cicha-navy')
    .replace(/to-\[#0B2545\]/g, 'to-cicha-navy')
    .replace(/via-\[#071E38\]/g, 'via-cicha-navy-dark')
    .replace(/from-\[#071E38\]/g, 'from-cicha-navy-dark')
    .replace(/to-\[#071E38\]/g, 'to-cicha-navy-dark')
    .replace(/to-\[#040D1A\]/g, 'to-cicha-navy-deep')
    .replace(/from-\[#040D1A\]/g, 'from-cicha-navy-deep')
    .replace(/text-\[#0D5EAF\]/g, 'text-cicha-blue')
    .replace(/bg-\[#0D5EAF\]/g, 'bg-cicha-blue')
    .replace(/border-\[#0D5EAF\]/g, 'border-cicha-blue')
    .replace(/to-\[#0D5EAF\]/g, 'to-cicha-blue')
    .replace(/text-\[#D4AF37\]/g, 'text-cicha-gold')
    .replace(/bg-\[#D4AF37\]/g, 'bg-cicha-gold')
    .replace(/border-\[#D4AF37\]/g, 'border-cicha-gold')
    .replace(/text-\[#B8860B\]/g, 'text-cicha-gold-dark')
    .replace(/bg-\[#B8860B\]/g, 'bg-cicha-gold-dark');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log('Migrated:', f);
  }
});

console.log(`Successfully migrated ${count} files to global cicha-* color tokens.`);
