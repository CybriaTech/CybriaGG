const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const url = require('url');

if (cluster.isMaster) {
  console.log(`Slave ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Slave ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  const targetUrl = 'https://now.gg';

  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    changeOrigin: true,
  });

  app.use('/', (req, res) => {
    const target = url.resolve(targetUrl, req.url);
    console.log(`Requests: ${req.url} - CYGGed to: ${target}`);
    proxy.web(req, res, { target });
  });

  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'default-src "self"; style-src "self"');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Type', 'text/html');

    next();
  });

  const server = http.createServer(app);

  const PORT = 8080;
  server.listen(PORT, () => {
    console.log(`CybriaGG Slave ${process.pid} has been successfully run! On Port ${PORT}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Slave ${process.pid} detected unhandled rejections:`, promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error(`Slave ${process.pid} uncaught exception:`, err);
  });
}
