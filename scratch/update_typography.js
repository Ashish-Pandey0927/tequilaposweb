/**
 * update_typography.js
 * 
 * Scans all HTML files across the workspace and injects standardized
 * typography classes (.page-h1, .page-h2, .page-h3, .page-p) onto
 * heading and paragraph tags that don't already have them.
 * 
 * Directories scanned: root, dark/, light/, tequila/
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const SCAN_DIRS = ['', 'dark', 'light', 'tequila'];

// Tag → class mapping
const TAG_CLASS_MAP = {
  h1: 'page-h1',
  h2: 'page-h2',
  h3: 'page-h3',
  p:  'page-p',
};

let totalFiles = 0;
let modifiedFiles = 0;
let totalTagsUpdated = 0;

/**
 * Collects all .html files from the given directory (non-recursive for safety,
 * but also checks one level of subdirs matching our scan list).
 */
function collectHtmlFiles() {
  const files = [];

  for (const dir of SCAN_DIRS) {
    const scanPath = dir ? path.join(BASE_DIR, dir) : BASE_DIR;
    if (!fs.existsSync(scanPath)) continue;

    const entries = fs.readdirSync(scanPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(scanPath, entry.name));
      }
    }
  }

  return files;
}

/**
 * Injects a typography class onto tags that don't already have it.
 * Uses a regex that matches opening tags with or without existing classes.
 */
function processHtml(content) {
  let modified = false;
  let tagsUpdated = 0;

  for (const [tag, cls] of Object.entries(TAG_CLASS_MAP)) {
    // Match opening tags: <h1 ...> or <h1> (capture tag with all attrs)
    // We avoid matching if the class is already present
    const tagRegex = new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi');

    content = content.replace(tagRegex, (match, attrs) => {
      // Skip if already has our class
      if (match.includes(cls)) return match;

      // Skip if it's likely an icon/template tag (e.g. <p style="display:none">)
      // We still inject — the class won't cause harm

      tagsUpdated++;
      modified = true;

      if (!attrs) {
        // <h2> → <h2 class="page-h2">
        return `<${tag} class="${cls}">`;
      }

      // Check if there's an existing class attribute
      if (/\bclass\s*=\s*["']/.test(attrs)) {
        // Append our class to the existing class value
        return `<${tag}${attrs.replace(
          /(\bclass\s*=\s*["'])([^"']*)(["'])/,
          (m, open, existing, close) => `${open}${existing} ${cls}${close}`
        )}>`;
      } else {
        // No class attribute — add one before the closing >
        return `<${tag}${attrs} class="${cls}">`;
      }
    });
  }

  return { content, modified, tagsUpdated };
}

// ── Main ────────────────────────────────────────────────────────────────────

const htmlFiles = collectHtmlFiles();
console.log(`\n🔍  Found ${htmlFiles.length} HTML files to process...\n`);

for (const filePath of htmlFiles) {
  totalFiles++;
  const original = fs.readFileSync(filePath, 'utf8');
  const { content, modified, tagsUpdated } = processHtml(original);

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFiles++;
    totalTagsUpdated += tagsUpdated;
    const rel = path.relative(BASE_DIR, filePath);
    console.log(`  ✅  ${rel}  (+${tagsUpdated} tags)`);
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊  Summary
  Total HTML files scanned : ${totalFiles}
  Files modified           : ${modifiedFiles}
  Total tags updated       : ${totalTagsUpdated}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
