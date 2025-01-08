import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

const API_KEY = 'pk_89025876_SZA4XBL23YJRA109O69PQL8VS4J2JIPX';

const proxy = createProxyMiddleware({
  target: 'https://api.clickup.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Set the Authorization header
    proxyReq.setHeader('Authorization', API_KEY);
    
    // Log the complete outgoing request details
    console.log('\nOutgoing Request Details:');
    console.log('URL:', proxyReq.path);
    console.log('Method:', proxyReq.method);
    console.log('Headers:', proxyReq.getHeaders());
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the response
    console.log('\nResponse Details:');
    console.log('Status Code:', proxyRes.statusCode);
    console.log('Status Message:', proxyRes.statusMessage);
    
    // Set CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

    // Log response body for debugging
    let body = '';
    proxyRes.on('data', function (chunk) {
      body += chunk;
    });
    proxyRes.on('end', function () {
      console.log('\nResponse Body:', body);
    });
  },
  onError: (err, req, res) => {
    console.error('\nProxy Error:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({
      error: 'Proxy server error',
      message: err.message,
      stack: err.stack
    }));
  },
  // Add logging for all proxy events
  logLevel: 'debug'
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log('\nIncoming request:');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  next();
});

app.use('/api', proxy);

const PORT = 3128;
app.listen(PORT, () => {
  console.log(`\nProxy server is running on http://localhost:${PORT}`);
  console.log(`API Key being used: ${API_KEY}`);
});