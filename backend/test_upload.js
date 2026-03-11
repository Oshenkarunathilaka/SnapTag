const fs = require('fs');
const http = require('http');

async function uploadFile(path, fieldname, filename) {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const content = fs.readFileSync(path);
  const prefix = '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name=\"' + fieldname + '\"; filename=\"' + filename + '\"\r\n' +
    'Content-Type: image/png\r\n\r\n';
  const suffix = '\r\n--' + boundary + '--\r\n';
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/' + (fieldname === 'tag' ? 'upload-tag' : 'upload-images'),
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': Buffer.byteLength(prefix) + content.length + Buffer.byteLength(suffix)
      }
    }, res => {
       res.on('data', () => {});
       res.on('end', () => resolve(res.statusCode));
    });
    req.write(prefix);
    req.write(content);
    req.write(suffix);
    req.end();
  });
}

async function runTest() {
  await uploadFile('../logo 2.png', 'images', 'test_img.png');
  await uploadFile('../logo 2.png', 'tag', 'test_tag.png');
  
  const req = http.request({
    hostname: 'localhost', port: 3001, path: '/api/process', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => { console.log('Process Result:', res.statusCode, d); });
  });
  req.write(JSON.stringify({ position: 'bottom-right', scale: 25 }));
  req.end();
}
runTest();
