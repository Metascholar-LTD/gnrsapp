// Script to copy PDF.js worker file to public folder
// This runs automatically after npm install via postinstall script

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dest = path.join(__dirname, '..', 'public', 'pdf.worker.min.js');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('✅ PDF.js worker copied successfully to public/pdf.worker.min.js');
  } else {
    // Try alternative path (some versions use .js instead of .mjs)
    const altSrc = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');
    if (fs.existsSync(altSrc)) {
      fs.copyFileSync(altSrc, dest);
      console.log('✅ PDF.js worker copied successfully to public/pdf.worker.min.js');
    } else {
      console.warn('⚠️  PDF.js worker file not found. Make sure pdfjs-dist is installed.');
    }
  }
} catch (error) {
  console.error('❌ Error copying PDF.js worker:', error.message);
  process.exit(1);
}

