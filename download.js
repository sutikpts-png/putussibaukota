const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Lambang_Kapuas_Hulu.png';
const dest = 'public/logo-kapuas-hulu.png';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download, status code:', res.statusCode);
    return;
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed');
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
