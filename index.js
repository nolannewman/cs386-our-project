const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const host = '0.0.0.0';

const server = http.createServer((req, res) => {
  // Setting the base directory for your files
  let filePath = '.' + req.url;
  if (filePath == './') {
    filePath = './public/index.html'; // Assuming your HTML file is located in the public directory
  } else {
    filePath = './public' + req.url; // Append '/public' to fetch other files like CSS
  }

  // Extract the file extension to set the correct content type
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    // You can add more MIME types as needed
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT') {
        // File not found, you could redirect to a custom 404 page
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
      } else {
        // Some server error
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    } else {
      // If no error, serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});

