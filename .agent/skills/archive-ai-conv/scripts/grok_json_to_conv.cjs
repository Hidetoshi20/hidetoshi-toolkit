const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node grok_json_to_conv.cjs <target_directory> <start_number> <json_file1> [json_file2] ...');
  process.exit(1);
}

const targetDir = path.resolve(args[0]);
const startNum = parseInt(args[1], 10);
const jsonFiles = args.slice(2);

if (isNaN(startNum)) {
  console.error('Error: start_number must be an integer.');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  console.log(`Creating directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

let allMessages = [];

jsonFiles.forEach(file => {
  if (!fs.existsSync(file)) {
      console.warn(`Warning: File not found ${file}`);
      return;
  }
  try {
      const content = fs.readFileSync(file, 'utf8');
      const json = JSON.parse(content);
      
      let msgs = [];
      if (json.responses && Array.isArray(json.responses)) {
        msgs = json.responses;
      } else if (Array.isArray(json)) {
        msgs = json;
      } else if (json.messages && Array.isArray(json.messages)) {
          // Format B support
          msgs = json.messages;
      }

      allMessages = allMessages.concat(msgs);
  } catch (e) {
      console.error(`Error parsing ${file}:`, e.message);
  }
});

// Deduplicate by responseId if available, otherwise trust the list
const uniqueMessages = new Map();
allMessages.forEach(msg => {
    // Prefer responseId, fallback to createTime+sender+content hash if needed
    // For this specific format, responseId is robust.
    if(msg.responseId) {
        uniqueMessages.set(msg.responseId, msg);
    } else {
        // If no ID, generate a pseudo key to avoid exact duplicates
        const key = `${msg.createTime}-${msg.sender}-${(msg.message || msg.content || '').substring(0, 20)}`;
        uniqueMessages.set(key, msg);
    }
});

const messages = Array.from(uniqueMessages.values());

// Sort by createTime
messages.sort((a, b) => {
    const timeA = new Date(a.createTime || a.created || 0);
    const timeB = new Date(b.createTime || b.created || 0);
    return timeA - timeB;
});

let pairs = [];
let pendingQuestion = null;

messages.forEach(msg => {
    const role = (msg.sender || msg.role || '').toLowerCase();
    const content = msg.message || msg.content || '';

    if (role === 'human' || role === 'user') {
        if (pendingQuestion) {
            // Previous question had no answer
            pairs.push({ q: pendingQuestion, a: null });
        }
        pendingQuestion = content;
    } else if (role === 'assistant' || role === 'model' || role === 'bot') {
        if (pendingQuestion) {
            pairs.push({ q: pendingQuestion, a: content });
            pendingQuestion = null;
        } else {
            // Answer without question (or continuation)
             pairs.push({ q: null, a: content });
        }
    }
});

if (pendingQuestion) {
    pairs.push({ q: pendingQuestion, a: null });
}

// Write files
console.log(`Found ${pairs.length} pairs. Writing to ${targetDir}...`);

pairs.forEach((pair, index) => {
    const num = startNum + index;
    
    if (pair.q) {
        fs.writeFileSync(path.join(targetDir, `${num}-0q.md`), pair.q);
    }
    
    if (pair.a) {
        fs.writeFileSync(path.join(targetDir, `${num}-1a.md`), pair.a);
    }
});

console.log(`Successfully converted JSON to ${pairs.length} conversation pairs starting from ${startNum}.`);
