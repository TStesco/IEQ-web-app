/* eslint-disable global-require, new-cap, no-sync */

'use strict';

const express = require('express');
const fs = require('fs');

const router = express.Router({caseSensitive: true});

// Export the router first so that it can be used by the controllers
module.exports = router;

// Require all of the controllers (they'll add their routes to the router)
const controllersDir = __dirname + '/controllers';
fs.readdirSync(controllersDir).forEach(controller => {
  if (!controller.endsWith('Controller.js')) return;
  require(controllersDir + '/' + controller);
});
