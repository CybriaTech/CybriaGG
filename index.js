const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Slave ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  const targetURL = 'https://educationbluesky.com'; // The Link Where Now.GG Roblox Gets Proxied

  const proxy = httpProxy.createProxyServer({
    target: targetURL,
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

    res.write('<title>CybriaGG | Play Roblox Online</title>'); // Dosent work :(( i fix it soon

    res.write('<link rel="icon" href="/public/cygg-invert-32x32.png">'); // Dosent work :(( i fix it soon

    res.write('</head><body>');

    next();
  });

  const server = http.createServer(app);

  const PORT = 80;
  server.listen(PORT, () => {
    console.log(`CybriaGG Slave ${process.pid} has been successfully run! On Port ${PORT}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Worker ${process.pid} detected unhandled rejections:`, promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error(`Worker ${process.pid} uncaught exception:`, err);
  });
}
