
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'www');

// 1. Agar 'www' folder nahi hai toh banao
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// 2. Files ki list jo copy karni hai
const filesToCopy = [
    'index.html',
    'index.tsx',
    'App.tsx',
    'types.ts'
];

// 3. Folders ki list jo copy karni hai
const foldersToCopy = [
    'components',
    'services'
];

function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('Building for mobile...');

filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(path.join(__dirname, file), path.join(outDir, file));
        console.log(`Copied: ${file}`);
    }
});

foldersToCopy.forEach(folder => {
    if (fs.existsSync(path.join(__dirname, folder))) {
        copyRecursive(path.join(__dirname, folder), path.join(outDir, folder));
        console.log(`Copied folder: ${folder}`);
    }
});

console.log('Build complete! Now run: npx cap sync');
