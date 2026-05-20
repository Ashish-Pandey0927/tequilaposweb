const fs = require('fs');
const path = require('path');

function walkDir(currentPath, callback) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'cdn.jsdelivr.net') {
        walkDir(fullPath, callback);
      }
    } else {
      callback(fullPath);
    }
  }
}

let filesUpdated = 0;
let buttonsUpdated = 0;

walkDir(path.join(__dirname, '..'), (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.html') return;

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  let fileWasModified = false;

  // 1. Process HTML buttons containing splide__arrow, carousel-arrow-left, carousel-arrow-right
  const tagRegex = /<([a-z0-9]+)\b([^>]*\bclass=["']([^"']*(?:splide__arrow|carousel-arrow-left|carousel-arrow-right)[^"']*)["'][^>]*)>/gi;

  content = content.replace(tagRegex, (match, tagName, attrs, classList) => {
    // Check if page-accent is already in the classList
    if (!/\bpage-accent\b/.test(classList)) {
      const newClassList = classList + ' page-accent';
      // Replace old class attribute with new one
      const newAttrs = attrs.replace(`class="${classList}"`, `class="${newClassList}"`)
                            .replace(`class='${classList}'`, `class='${newClassList}'`);
      buttonsUpdated++;
      fileWasModified = true;
      return `<${tagName}${newAttrs}>`;
    }
    return match;
  });

  // 2. Swapping static image tags with clean, styleable chevrons for prev/next buttons
  const prevButtonRegex = /(<button\b[^>]*\bclass=["'][^"']*\bsplide__arrow--prev\b[^"']*["'][^>]*>)([\s\S]*?)(<\/button>)/gi;
  content = content.replace(prevButtonRegex, (match, openTag, innerHtml, closeTag) => {
    if (innerHtml.includes('<img') || innerHtml.trim() === '') {
      fileWasModified = true;
      return `${openTag}‹${closeTag}`;
    }
    return match;
  });

  const nextButtonRegex = /(<button\b[^>]*\bclass=["'][^"']*\bsplide__arrow--next\b[^"']*["'][^>]*>)([\s\S]*?)(<\/button>)/gi;
  content = content.replace(nextButtonRegex, (match, openTag, innerHtml, closeTag) => {
    if (innerHtml.includes('<img') || innerHtml.trim() === '') {
      fileWasModified = true;
      return `${openTag}›${closeTag}`;
    }
    return match;
  });

  // 3. Process script blocks in hardware.html / dark/hardware.html where custom dynamic arrows are created
  if (filePath.includes('hardware.html')) {
    const leftBtnRegex = /leftBtn\.className\s*=\s*(["'])carousel-arrow-left\1/g;
    const rightBtnRegex = /rightBtn\.className\s*=\s*(["'])carousel-arrow-right\1/g;
    if (leftBtnRegex.test(content) || rightBtnRegex.test(content)) {
      content = content.replace(leftBtnRegex, 'leftBtn.className = "carousel-arrow-left page-accent"');
      content = content.replace(rightBtnRegex, 'rightBtn.className = "carousel-arrow-right page-accent"');
      fileWasModified = true;
    }
  }

  if (fileWasModified && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`Updated: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
});

console.log(`\nScan complete!`);
console.log(`Files modified: ${filesUpdated}`);
console.log(`Arrow class instances added/updated: ${buttonsUpdated}`);
