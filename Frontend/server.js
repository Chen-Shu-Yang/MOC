/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const serveStatic = require('serve-static');

// set hostname and portnumber
const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method !== 'GET') {
    res.type('.html');
    const msg = '<html><body>This server only serves web pages with GET!</body></html>';
    res.end(msg);
  } else {
    next();
  }
});

// go to homepage
app.get('/', (req, res) => {
  res.sendFile('/public/assets/html/index.html', { root: __dirname });
});
// go to homepage
app.get('/homepage', (req, res) => {
  res.sendFile('/public/assets/html/index.html', { root: __dirname });
});
// go to login
app.get('/login', (req, res) => {
  res.sendFile('/public/assets/html/login.html', { root: __dirname });
});

// retrieve from public folder
app.use(serveStatic(`${__dirname}/public`));

// listen to hostname and port

app.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});
