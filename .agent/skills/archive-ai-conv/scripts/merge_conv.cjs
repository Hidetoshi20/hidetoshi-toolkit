const fs = require('fs');
const path = require('path');

const dirPath = process.argv[2];
const outputFile = process.argv[3] || 'README.md';

if (!dirPath) {
  console.error('Usage: node merge_conv.cjs <directory_path> [output_filename]');
  process.exit(1);
}

const absDirPath = path.resolve(dirPath);
const absOutputPath = path.join(absDirPath, outputFile);

if (!fs.existsSync(absDirPath)) {
  console.error(`Directory not found: ${absDirPath}`);
  process.exit(1);
}

try {
  const files = fs.readdirSync(absDirPath);
  const pairs = new Map();

  // Identify pairs
  files.forEach(file => {
    const qMatch = file.match(/^(\d+)-(?:0)?q\.md$/);
    const aMatch = file.match(/^(\d+)-(?:1)?a\.md$/);

    if (qMatch) {
      const id = parseInt(qMatch[1], 10);
      if (!pairs.has(id)) pairs.set(id, {});
      pairs.get(id).q = file;
    } else if (aMatch) {
      const id = parseInt(aMatch[1], 10);
      if (!pairs.has(id)) pairs.set(id, {});
      pairs.get(id).a = file;
    }
  });

  // Sort by ID
  const sortedIds = Array.from(pairs.keys()).sort((a, b) => a - b);
  
  if (sortedIds.length === 0) {
      console.log('No conversation files found to merge.');
      process.exit(0);
  }

  // Helper to demote headers in content so they fit under the main structure
  const demoteHeaders = (text) => {
    const headers = text.match(/^#+\s/gm);
    if (!headers) return text;
    
    // Calculate the minimum header level found in the text
    const minLevel = Math.min(...headers.map(h => h.trim().length));
    
    // We want the resulting headers to start at least at level 3 (###)
    // because they are nested under "## Question" or "## Answer"
    const targetLevel = 3;
    const shift = Math.max(0, targetLevel - minLevel);
    
    if (shift === 0) return text;

    return text.replace(/^#+/gm, (match) => {
      return '#'.repeat(match.length + shift);
    });
  };

  let mergedContent = `# Conversation Archive\n\nGenerated from ${path.basename(absDirPath)}\n\n`;

  sortedIds.forEach(id => {
    const pair = pairs.get(id);
    mergedContent += `## ${id}. Question\n\n`;
    
    if (pair.q) {
        const qContent = fs.readFileSync(path.join(absDirPath, pair.q), 'utf8').trim();
        mergedContent += `${demoteHeaders(qContent)}\n\n`;
    } else {
        mergedContent += `*(Question file missing)*\n\n`;
    }

    mergedContent += `## Answer\n\n`;
    
    if (pair.a) {
        const aContent = fs.readFileSync(path.join(absDirPath, pair.a), 'utf8').trim();
        mergedContent += `${demoteHeaders(aContent)}\n\n`;
    } else {
        mergedContent += `*(Answer file missing)*\n\n`;
    }

    mergedContent += `---\n\n`;
  });

  fs.writeFileSync(absOutputPath, mergedContent);
  console.log(`Successfully merged ${sortedIds.length} conversation pairs into ${absOutputPath}`);

} catch (error) {
  console.error('Error merging files:', error);
  process.exit(1);
}
