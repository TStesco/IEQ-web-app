/**
 * Comfort Controller
 */

'use strict';

const exec = require('child_process').exec;

const router = require('../router');

router.get('/comfort', (req, res) => {
  exec(`python3 ${__dirname}/../../python/comfort_analysis.py`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(err.toString() + '\n' + stderr);
      return;
    }
    res.set('Content-Type', 'application/json');
    res.send(stdout);
  });
});
