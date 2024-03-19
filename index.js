const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const nggUrl = 'https://educationbluesky.com';

const proxy = createProxyMiddleware({
  target: nggUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    return nggUrl;
  }
});

app.use('/', proxy);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`CybriaGG is running on port ${port}`);
});
