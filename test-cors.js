const http = require('https');
const data = JSON.stringify({ email: 'test@example.com', password: 'password' });

const req = http.request('https://test-platform-fzhc.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log('Status POST /api/auth/login:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});
req.write(data);
req.end();
