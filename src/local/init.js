/**
 * Setup environment and initialize the angular2 polyfills.
 */
if (typeof global === 'undefined' && typeof window !== 'undefined') {
  window.global = window;
  if (typeof process === 'undefined') {
    window.process = {
      env: {
        NODE_ENV: 'production'
      }
    };
  }
}

require('es6-shim');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('reflect-metadata');
