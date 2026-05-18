const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const linkMap = {
    'About Us': 'about.html',
    'Contact Us': 'contact.html',
    'Hardware': 'hardware.html',
    'Pricing': 'pricing.html',
    'Resources': 'resourse.html',
    'PAX A920': 'a920.html',
    'PAX A35': 'a35-android.html',
    'MagTek DynaFlex': 'magtek.html',
    'PAX Elys Workstation': 'elys-workstation.html',
    'Terms & Condition': 'terms-and-conditions.html', // placeholder if not exists
    'Privacy Policy': 'privacy-policy.html' // placeholder if not exists
};

function getRelativePath(currentFile, targetFile) {
    const relative = path.relative(path.dirname(currentFile), path.join(rootDir, targetFile));
    return relative.replace(/\\/g, '/');
}

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                traverseDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = content;

    // This regex looks for <a> tags in the footer specifically, but for safety 
    // we will look for text patterns that match our map inside <a> tags.
    Object.keys(linkMap).forEach(text => {
        const targetHtml = linkMap[text];
        const relPath = getRelativePath(filePath, targetHtml);
        
        // Improved regex to find <a> tags containing the specific text
        // Handles newlines and whitespace within attributes and tags
        const regex = new RegExp(`(<a[^>]+href\\s*=\\s*["'])#(["'][^>]*>\\s*${text}\\s*</a\\s*>)`, 'gi');
        modified = modified.replace(regex, `$1${relPath}$2`);
    });

    if (content !== modified) {
        fs.writeFileSync(filePath, modified);
        console.log(`Updated footer links in ${path.relative(rootDir, filePath)}`);
    }
}

traverseDir(rootDir);
console.log('Footer link fix complete.');
