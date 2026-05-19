const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Let's check if the raw HTML has .nav-icon in it
    console.log("Has nav-icon:", data.includes('nav-icon'));
    // Since it's a React app, the raw HTML from localhost:3000 will just be the index.html template!
    // So this won't help much.
  });
});
