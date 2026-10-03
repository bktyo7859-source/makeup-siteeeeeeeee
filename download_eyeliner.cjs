const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          return downloadFile(res.headers.location, dest).then(resolve);
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        resolve();
      }
    }).on('error', () => resolve());
  });
}

async function run() {
  const eyelinerUrls = [
    { url: 'https://images.somethinc.com/uploads/products/thumbs/500x500/Website_PDP-02.jpg', dest: 'public/media/eyeliner_1.jpg' },
    { url: 'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f42769%2f42769_1.png', dest: 'public/media/eyeliner_2.png' },
    { url: 'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f42769%2f42769_2.png', dest: 'public/media/eyeliner_3.png' },
    { url: 'https://media-cdn.oriflame.com/productImage?externalMediaId=product-management-media%2fProducts%2f42769%2f42769_3.png', dest: 'public/media/eyeliner_4.png' }
  ];

  for (const item of eyelinerUrls) {
    console.log(`Downloading: ${item.url}`);
    await downloadFile(item.url, item.dest);
    console.log(`Saved: ${item.dest}`);
  }
}

run();
