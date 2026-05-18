const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function getRelativePathToJs(filePath) {
    const depth = path.relative(rootDir, path.dirname(filePath)).split(path.sep).filter(p => p !== '').length;
    let relPath = '';
    for(let i=0; i<depth; i++) {
        relPath += '../';
    }
    return (relPath === '' ? './' : relPath) + 'assets/js/videoPlay.js';
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has a video section
    const hasVideo = content.includes('id="videoFrame"') || 
                     content.includes('id="playVideoBtn"') || 
                     content.includes('class="play-video-btn"') ||
                     content.includes('video section');

    if (!hasVideo) return;

    const jsPath = getRelativePathToJs(filePath);
    const scriptTag = `<script src="${jsPath}"></script>`;

    let modified = content;

    // Check if videoPlay.js is already included
    const scriptRegex = /<script\s+src="[^"]*videoPlay\.js"><\/script>/gi;
    if (scriptRegex.test(content)) {
        // Replace existing script with the correct relative path
        modified = content.replace(scriptRegex, scriptTag);
    } else {
        // Add script before </body> if it has a video but no script
        if (content.includes('</body>')) {
            modified = content.replace('</body>', `    ${scriptTag}\n  </body>`);
        } else {
            modified = content + `\n${scriptTag}`;
        }
    }

    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Fixed video script in ${filePath}`);
    }
}

function traverseDir(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('assets')) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

traverseDir(rootDir);
console.log('Done');
