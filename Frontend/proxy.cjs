// proxy.js
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://localhost:5173',
  changeOrigin: true,
  secure: false // Accept self-signed SSL certs
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, {}, (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502);
    res.end('Proxy failed');
  });
});

server.listen(5174, () => {
  console.log('HTTP proxy running on http://localhost:5174 → https://localhost:5173');
});
