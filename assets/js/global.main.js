'use strict';

// Need to make jQuery global for bootstrap to work
window.$ = window.jQuery = require('jquery');
require('bootstrap');

// Live reloading
if (process.env.NODE_ENV === 'development') {
  const script = document.createElement('script');
  script.src = '//' + location.hostname + ':35729/livereload.js?snipver=1';
  document.body.appendChild(script);
}
