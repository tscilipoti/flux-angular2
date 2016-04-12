const jsdom = require('jsdom');

// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body id="page-body-content"><HostView>Loading...</HostView></div></body></html>');

// get the window object out of the document
const win = doc.defaultView;

// workaround for zone.js
global.XMLHttpRequest = function () {};
global.XMLHttpRequest.prototype.send = function () {};

// defines angular2 dependencies
require('../local/init');

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

// setup angular2 shims
window.Reflect = global.Reflect;
window.requestAnimationFrame = function () {};
