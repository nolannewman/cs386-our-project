const http = require('http');

// sample code
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

const port = 3000;
const host = '0.0.0.0';
server.listen(port, host, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
