const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const path = require('path');

const app = express();

const nggUrl = 'https://educationbluesky.com'; // Link where the NowGG roblox gets proxied as CybriaGG <3

const proxy = httpProxy.createProxyServer({
  target: nggUrl,
  changeOrigin: true,
});

app.use('/', (req, res) => {
  console.log(`Incoming Requests: ${req.url}`);

  proxy.web(req, res);
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'default-src "self"; style-src "self"');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Type', 'text/html');

  res.write('<html><head>');

  res.write('<title>CybriaGG | Play Roblox Online</title>'); // This is still WIP, ill fix it eventually

  res.write('<link rel="icon" href="/public/cygg-invert-32x32.png">'); // This is still WIP, ill fix it eventually

  res.write('</head><body>');

  next();
});


const server = http.createServer(app);

const PORT = 80;
server.listen(PORT, () => {
  console.log(`CybriaGG Has Been Successfully Run! On Port ${PORT}`);
});
