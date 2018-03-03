/**
 * app.js - Application entry point. Starts the server.
 */

'use strict';

const apiRouter = require('./api/router');
const compression = require('compression');
const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');
const morgan = require('morgan');
const viewPaths = require('./config/viewPaths');

const app = express();

app.disable('x-powered-by');
app.set('case sensitive routing', true);
app.set('view engine', 'ejs');
app.set('view options', { // This is undocumented but works (maybe should open issue about it)
  strict: true,
  rmWhitespace: app.get('env') === 'production',
});

app.use(favicon('./_static/favicon.ico', {
  maxAge: 1000 * 60 * 60 * 24 * 7 * 3, // 3 weeks - should remove this when we have a legit favicon
}));

/* istanbul ignore if: Don't want to log to console when testing */
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan(':remote-addr [:date] ":method :url HTTP/:http-version" :status ":referrer" ":user-agent"', {
      skip: (req, res) => res.statusCode < 400, // Only log errors
      stream: fs.createWriteStream(process.env.WWW_ACCESS_LOG, {flags: 'a'}),
    })
  );
}

/* istanbul ignore if: Shouldn't (can't?) use compression when testing */
if (app.get('env') === 'production') {
  app.use(compression());
}

// Configure API routes
app.use('/api', apiRouter);

// Configure view routes
for (const view in viewPaths) {
  app.get(viewPaths[view], (req, res) => {
    res.render(view);
  });
}

// Configure static resources
app.use(express.static('./_static', {
  index: false,
  redirect: false,
}));

// Start the server
const port = process.env.PORT || 8080;
const host = process.env.HOST;
app.listen(port, host, () => {
  const hostName = app.get('env') === 'production' ? '*' : 'localhost';
  console.log(`Express server listening at http://${hostName}:${port}`);
});

module.exports = app;
