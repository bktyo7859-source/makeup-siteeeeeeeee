const fs = require('fs');
const path = require('path');

const files = [
  'forever-stay-waterproof-liquid-eyeliner-renewal.htm',
  'product.htm',
  'shop-beauty-products-french-women-color-swear-by.htm',
  'imgres.htm',
  'imgres (1).htm',
  'imgres (2).htm',
  'imgres (3).htm',
  'imgres (4).htm',
  'imgres (5).htm'
];

if (!fs.existsSync('public/media')) {
  fs.mkdirSync('public/media', { recursive: true });
}

files.forEach((f, fileIdx) => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    console.log(`\n=== Processing: ${f} ===`);
    
    // Find img tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    let count = 0;
    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      if (src.startsWith('data:image')) {
        const parts = src.split(',');
        const mime = parts[0];
        const base64Data = parts[1];
        if (base64Data && base64Data.length > 3000) {
          const ext = mime.includes('png') ? 'png' : 'jpg';
          const cleanName = f.replace(/[^a-zA-Z0-9]/g, '_');
          const outName = `${cleanName}_img_${count}.${ext}`;
          fs.writeFileSync(path.join('public/media', outName), Buffer.from(base64Data, 'base64'));
          console.log(`  Saved base64: ${outName} (${base64Data.length} chars)`);
          count++;
        }
      } else if (src.startsWith('http')) {
        console.log(`  Remote img: ${src.substring(0, 80)}`);
      }
    }
  }
});
