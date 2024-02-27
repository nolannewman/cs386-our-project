const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;
const host = '0.0.0.0';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  let filePath = '.' + pathname;

  if (filePath.includes('/CalorieFunctions')) {
    // check for query
    const query = parsedUrl.query;
    // log parameters for debugging
    //console.log('Accessing calorie functions with query params:', query);

    // if query goal doesn't exist
    if (!query.goal) {
      // set to maintaining as default val
      const newUrl = req.url + (req.url.includes('?') ? '&' : '?') + 'goal=MAINTAINING';
      res.writeHead(302, { Location: newUrl });
      res.end();
      return; 
    }
  }

  if (filePath === './') {
    filePath = './public/index.html';
  } else {
    filePath = filePath.startsWith('./public/') ? filePath : './public' + pathname;
  }

  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
