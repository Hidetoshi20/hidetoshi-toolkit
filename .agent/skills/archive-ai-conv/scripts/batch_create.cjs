const fs = require('fs');
const path = require('path');

/**
 * Batch create AI conversation archive files.
 * Usage: node batch_create.cjs <directory> <start_number> <count>
 */

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node batch_create.cjs <directory> <start_number> <count>');
  process.exit(1);
}

const targetDir = path.resolve(args[0]);
const startNum = parseInt(args[1], 10);
const count = parseInt(args[2], 10);

if (isNaN(startNum) || isNaN(count)) {
  console.error('Error: start_number and count must be integers.');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  console.log(`Creating directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

for (let i = 0; i < count; i++) {
  const num = startNum + i;
  const qFile = path.join(targetDir, `${num}-0q.md`);
  const aFile = path.join(targetDir, `${num}-1a.md`);

  if (!fs.existsSync(qFile)) {
    fs.writeFileSync(qFile, '');
    console.log(`Created: ${qFile}`);
  } else {
    console.log(`Skipped (already exists): ${qFile}`);
  }

  if (!fs.existsSync(aFile)) {
    fs.writeFileSync(aFile, '');
    console.log(`Created: ${aFile}`);
  } else {
    console.log(`Skipped (already exists): ${aFile}`);
  }
}

console.log('Success: Finished batch creation.');
