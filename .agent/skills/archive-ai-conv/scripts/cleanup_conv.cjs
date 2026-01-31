const fs = require('fs');
const path = require('path');

const dirPath = process.argv[2];

if (!dirPath) {
  console.error('Usage: node cleanup_conv.cjs <directory_path>');
  process.exit(1);
}

const absDirPath = path.resolve(dirPath);

if (!fs.existsSync(absDirPath)) {
  console.error(`Directory not found: ${absDirPath}`);
  process.exit(1);
}

try {
  const files = fs.readdirSync(absDirPath);
  let deletedCount = 0;

  files.forEach(file => {
    // Matches 1-q.md, 1-0q.md, 1-a.md, 1-1a.md
    if (file.match(/^(\d+)-(?:0)?q\.md$/) || file.match(/^(\d+)-(?:1)?a\.md$/)) {
      fs.unlinkSync(path.join(absDirPath, file));
      deletedCount++;
    }
  });

  console.log(`Successfully deleted ${deletedCount} conversation files in ${absDirPath}`);

} catch (error) {
  console.error('Error deleting files:', error);
  process.exit(1);
}
