// gta6-meme-x-01 entry: the post itself is the entry. This program copies
// POST.json (the X post's address) to /output/POST.json, where the gate reads it.
// It first checks POST.json really names one X post, so a placeholder or a
// mistyped address fails loudly instead of being handed in.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postPath = join(BOT_DIR, 'POST.json');
function readPost(path: string): { url?: unknown } {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as { url?: unknown };
  } catch (err) {
    console.error(`POST.json could not be read as JSON: ${(err as Error).message}`);
    process.exit(1);
  }
}
const post = readPost(postPath);
if (typeof post.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
  console.error('POST.json must name an X post address, e.g. https://x.com/<handle>/status/<id>');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
