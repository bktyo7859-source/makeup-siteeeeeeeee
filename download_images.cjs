const fs = require('fs');
const path = require('path');
const https = require('https');

const mapping = [
  { file: 'imgres.htm', category: 'lipstick' },
  { file: 'imgres (1).htm', category: 'lipstick_alt' },
  { file: 'imgres (2).htm', category: 'blush' },
  { file: 'imgres (3).htm', category: 'blush_alt' },
  { file: 'imgres (4).htm', category: 'nail_paint' },
  { file: 'imgres (5).htm', category: 'skincare_set' },
  { file: 'forever-stay-waterproof-liquid-eyeliner-renewal.htm', category: 'eyeliner' },
  { file: 'product.htm', category: 'eyeliner_stylo' }
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        resolve(); // skip non-200
      }
    }).on('error', (err) => {
      resolve();
    });
  });
}

async function run() {
  for (const item of mapping) {
    if (fs.existsSync(item.file)) {
      const content = fs.readFileSync(item.file, 'utf8');
      const urls = [...content.matchAll(/src=["'](https:\/\/encrypted-tbn[0-9]?\.gstatic\.com\/images\?q=tbn:[^"']+)["']/gi)].map(m => m[1]);
      console.log(`Found ${urls.length} images for ${item.category}`);
      for (let i = 0; i < Math.min(urls.length, 6); i++) {
        const dest = path.join('public/media', `${item.category}_${i + 1}.jpg`);
        await downloadFile(urls[i], dest);
        console.log(`  Downloaded: ${dest}`);
      }
    }
  }
}

run();
