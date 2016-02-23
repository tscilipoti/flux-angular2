const jsdom = require('jsdom');

// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body id="page-body-content"><HostView>Loading...</HostView></div></body></html>');

// get the window object out of the document
const win = doc.defaultView;

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.window = win;

// take all properties of the window object and also attach it to the
// mocha global object
for (const key in win) {
  if (!window.hasOwnProperty(key)) continue;
  if (key in global) continue;

  global[key] = window[key];
}

require('angular2/bundles/angular2-polyfills');
global.Reflect = window.Reflect;
window.requestAnimationFrame = function () {};

if (global.zone) {
  console.log('zone defined on global');
}
if (global.Zone) {
  console.log('Zone defined on global');
}
if (window.zone) {
  console.log('zone defined on window');
}
if (window.Zone) {
  console.log('Zone defined on window');
}
