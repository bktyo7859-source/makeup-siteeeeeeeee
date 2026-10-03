const fs = require('fs');
const https = require('https');
const path = require('path');

const files = ['forever-stay-waterproof-liquid-eyeliner-renewal.htm', 'product.htm'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    console.log(`=== ${f} ===`);
    const urls = [...content.matchAll(/https?:\/\/[^"' \t\r\n<>]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]);
    console.log(`Found ${urls.length} image URLs`);
    urls.slice(0, 10).forEach(u => console.log(' ', u));
  }
});
