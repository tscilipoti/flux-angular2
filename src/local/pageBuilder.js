import Page from './page';
import View from './view';
import * as JSDOM from 'jsdom';

/**
 * Class used to build html output for pages.
 */
export default class PageBuilder {

  /**
   * @constructor
   */
  constructor() {
    this.mStyleSheets = [];
    this.mScripts = [];
  }

  /**
   * Get the stylesheet tags for the page.
   */
  get styleSheets() {
    return this.mStyleSheets;
  }

  /**
   * Set the stylesheet tags for the page.
   * @param {String|String[]} value - A stylesheet tag or array of stylesheet tags.
   * @returns {void}
   */
  set styleSheets(value) {
    this.mStyleSheets = value;
  }

  /**
   * Get the script tags for the page.
   */
  get scripts() {
    return this.mScripts;
  }

  /**
   * Set the scripts tags for the page.
   * @param {String|String[]} value - A script tag or array of script tags.
   * @returns {void}
   */
  set scripts(value) {
    this.mScripts = value;
  }

  /**
   * Write the given page out to a string.
   * @param {View} view - The view to render to string.
   * @param {Object} props - Optional properties to render.
   * @returns {String} A string representation of the given page.
   */
  renderToString(view, props) {
    const styleSheets = (Array.isArray(this.styleSheets) ? this.styleSheets.join('\n    ') : this.styleSheets) || '';
    const scripts = (Array.isArray(this.scripts) ? this.scripts.join('\n    ') : this.scripts) || '';
    const selector = (view ? View.getSelector(view) : 'div');
    const propTag = (props ? '<script id="page-props" type="application/json">' + JSON.stringify(props) + '</script>' : '');

    return `<!DOCTYPE HTML>
<html>
  <head>
    ${styleSheets}
    ${propTag}
    ${scripts}
  </head>
  <body>
    <${selector}></${selector}>
  </body>
</html>`;
  }

  /**
   * Load the given view and then render it into a jsdom document object for unit testing.
   * @param {Object} opts - The options for the function.
   * @param {View} opts.view - The view to load and render.
   * @param {Object} opts.props - Properties for the view.
   * @param {Array | String} opts.styleSheets - The stylesheets for the document.
   * @param {Array | String} opts.scripts - The script tags for the document.
   * @return {Document} A document object that contains the rendered output from the view.
   */
  static renderToDocument(opts = {}) {
    const pb = new PageBuilder();
    pb.styleSheets = opts.styleSheets;
    pb.scripts = opts.scripts;
    return JSDOM.jsdom(pb.renderToString(opts.view, opts.props));
  }

  /**
   * Render and load the given view for testing.
   * @param {Object} opts - Options for the function.
   * @param {View} opts.view - The view to load.
   * @param {Object} opts.props - The properties for the view.
   * @param {Object} opts.sessionStorage - The values for the session storage.
   * @param {Object} opts.localStorage - The values for the local storage.
   * @return {Promise} A promise that resolves with the loaded page.
   */
  static test(opts = {}) {
    Page.localStorage.clear();
    Page.sessionStorage.clear();

    if (opts.sessionStorage) {
      for (const propName in opts.sessionStorage) {
        if (opts.sessionStorage.hasOwnProperty(propName)) {
          Page.sessionStorage.setItem(propName, opts.sessionStorage[propName]);
        }
      }
    }
    if (opts.localStorage) {
      for (const propName in opts.localStorage) {
        if (opts.localStorage.hasOwnProperty(propName)) {
          Page.localStorage.setItem(propName, opts.localStorage[propName]);
        }
      }
    }

    global.document = PageBuilder.renderToDocument(opts);
    return Page.load(opts.view, opts.props);
  }

  /**
   * Initialize test environment.  Should be called once, before any tests are run.
   * @return {void}
   */
  static testSetup() {
    // setup the simplest document possible
    const doc = JSDOM.jsdom('<!doctype html><html><body id="page-body-content"><HostView>Loading...</HostView></div></body></html>');

    // get the window object out of the document
    const win = doc.defaultView;

    // workaround for zone.js
    global.XMLHttpRequest = function () {};
    global.XMLHttpRequest.prototype.send = function () {};

    // defines angular2 dependencies
    require('./init');

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
  }
}
