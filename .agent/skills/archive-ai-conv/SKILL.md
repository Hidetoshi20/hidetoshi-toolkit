---
name: archive-ai-conv
description: Archiving AI conversations into markdown files with a numbered naming convention (e.g., 1-0q.md, 1-1a.md). Use when the user wants to organize, archive, or batch-create files for storing dialogue history.
---

# Archive AI Conversation

## Overview

This skill helps automate the process of archiving AI conversations. It follows a specific naming convention where each conversation pair consists of a question file (`{number}-0q.md`) and an answer file (`{number}-1a.md`).

## Workflow

### 1. Identify Target Directory
Determine where the conversation files should be stored. If the directory doesn't exist, it will be created.

### 2. Determine Numbering
Identify the starting number for the new files. Usually, this is 1 or the next available number in the sequence within the target directory.

### 3. Batch Create Files
Use the provided script to create empty placeholder files for the conversations.

```bash
node scripts/batch_create.cjs <directory_path> <start_number> <count>
```

### 4. Merge Conversations
Combine all separate conversation files in a directory into a single readable Markdown file (e.g., `README.md`).

```bash
node scripts/merge_conv.cjs <directory_path> [output_filename]
```

### 5. Cleanup Conversations
Delete the original conversation files after they have been merged.

```bash
node scripts/cleanup_conv.cjs <directory_path>
```

## Examples

### Batch Creating New Files
If a user asks to "create 10 pairs of archive files starting from 5 in the thoughts folder":
1. Check the path: `thoughts/`
2. Run script: `node scripts/batch_create.cjs thoughts/ 5 10`

### Merging and Cleaning Up
If a user wants to merge files and delete the originals:
1. Merge: `node scripts/merge_conv.cjs thoughts/History/ README.md`
2. Cleanup: `node scripts/cleanup_conv.cjs thoughts/History/`

### Archiving a Conversation
If a user wants to archive the current conversation:
1. Find the next available number in the target directory (e.g., `thoughts/欧洲高水平生活成因/`).
2. Save the user's prompt to `X-0q.md`.
3. Save the AI's response to `X-1a.md`.

## Resources

### scripts/batch_create.cjs
A Node.js script to create multiple pairs of conversation files at once.
- **Arguments**: `<directory> <start_number> <count>`

### scripts/merge_conv.cjs
A Node.js script to merge numbered conversation files into a single Markdown file.
- **Arguments**: `<directory> [output_filename]`
- **Default Output**: `README.md`

### scripts/cleanup_conv.cjs
A Node.js script to delete numbered conversation files from a directory.
- **Arguments**: `<directory>`